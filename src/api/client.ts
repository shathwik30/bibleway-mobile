import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/constants/api';
import { ENDPOINTS } from './endpoints';

console.log('[API] Base URL:', API_BASE_URL);

// Retry config for network errors (e.g. Railway cold starts)
const MAX_NETWORK_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isNetworkError = (error: AxiosError) =>
  !error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.message === 'Network Error');

// Module-level refresh state for race condition handling
let refreshPromise: Promise<string> | null = null;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor - attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Import dynamically to avoid circular deps
    const { useAuthStore } = require('@/stores/authStore');
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let Axios auto-set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - retry on network errors (handles Railway cold starts)
apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as InternalAxiosRequestConfig & { _networkRetry?: number };
  if (!config || !isNetworkError(error)) return Promise.reject(error);

  config._networkRetry = (config._networkRetry || 0) + 1;
  if (config._networkRetry > MAX_NETWORK_RETRIES) {
    console.warn(`[API] Network error after ${MAX_NETWORK_RETRIES} retries:`, error.code, error.message, config.url);
    return Promise.reject(error);
  }

  console.log(`[API] Network error (${error.code}), retry ${config._networkRetry}/${MAX_NETWORK_RETRIES} for ${config.url}`);
  await sleep(RETRY_DELAY_MS * config._networkRetry);
  return apiClient(config);
});

// Response interceptor - unwrap { message, data } envelope
apiClient.interceptors.response.use(
  (response) => {
    // If the response body has a `data` key from our API envelope, unwrap it
    const body = response.data;
    if (body && typeof body === 'object' && 'data' in body && 'message' in body) {
      response.data = body.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh if this IS the refresh request
    if (originalRequest.url?.includes('token/refresh')) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (refreshPromise) {
      // Another refresh is already in progress - queue this request
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Start refresh
    refreshPromise = (async () => {
      try {
        const { getSecureValue } = require('@/lib/secureStorage');
        const refreshToken = await getSecureValue('refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.auth.refreshToken}`,
          { refresh: refreshToken }
        );

        const body = response.data;
        const { access, refresh } = body && 'data' in body ? body.data : body;
        const { useAuthStore } = require('@/stores/authStore');
        const { saveSecureValue } = require('@/lib/secureStorage');

        useAuthStore.getState().setAccessToken(access);
        if (refresh) {
          await saveSecureValue('refresh_token', refresh);
        }

        processQueue(null, access);
        return access;
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth state and navigate to login
        const { useAuthStore } = require('@/stores/authStore');
        useAuthStore.getState().logout();
        throw refreshError;
      } finally {
        refreshPromise = null;
      }
    })();

    const newToken = await refreshPromise;
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return apiClient(originalRequest);
  }
);

export default apiClient;

// Typed helpers
export const api = {
  get: <T>(url: string, params?: any) =>
    apiClient.get<T>(url, { params }).then((res) => res.data),
  post: <T>(url: string, data?: any) =>
    apiClient.post<T>(url, data).then((res) => res.data),
  put: <T>(url: string, data?: any) =>
    apiClient.put<T>(url, data).then((res) => res.data),
  patch: <T>(url: string, data?: any) =>
    apiClient.patch<T>(url, data).then((res) => res.data),
  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((res) => res.data),
};
