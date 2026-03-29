import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/constants/api';
import { ENDPOINTS } from './endpoints';

const MAX_NETWORK_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isNetworkError = (error: AxiosError) =>
  !error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.message === 'Network Error');

let refreshPromise: Promise<string> | null = null;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token ?? '');
    }
  });
  failedQueue = [];
};

// Lazy-loaded store/lib references to avoid circular imports
let _getAuthStore: (() => { accessToken: string | null; setAccessToken: (t: string) => void; logout: () => Promise<void> }) | null = null;
let _getSecureValue: ((key: string) => Promise<string | null>) | null = null;
let _saveSecureValue: ((key: string, value: string) => Promise<void>) | null = null;

function getAuthStore() {
  if (!_getAuthStore) {
    const { useAuthStore } = require('@/stores/authStore');
    _getAuthStore = () => useAuthStore.getState();
  }
  return _getAuthStore();
}

async function getSecureValue(key: string): Promise<string | null> {
  if (!_getSecureValue) {
    const mod = require('@/lib/secureStorage');
    _getSecureValue = mod.getSecureValue;
  }
  return _getSecureValue!(key);
}

async function saveSecureValue(key: string, value: string): Promise<void> {
  if (!_saveSecureValue) {
    const mod = require('@/lib/secureStorage');
    _saveSecureValue = mod.saveSecureValue;
  }
  return _saveSecureValue!(key, value);
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthStore().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as InternalAxiosRequestConfig & { _networkRetry?: number };
  if (!config || !isNetworkError(error)) return Promise.reject(error);

  config._networkRetry = (config._networkRetry || 0) + 1;
  if (config._networkRetry > MAX_NETWORK_RETRIES) {
    return Promise.reject(error);
  }

  await sleep(RETRY_DELAY_MS * config._networkRetry);
  return apiClient(config);
});

apiClient.interceptors.response.use(
  (response) => {
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

    if (originalRequest.url?.includes('token/refresh')) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (refreshPromise) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    refreshPromise = (async () => {
      try {
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

        getAuthStore().setAccessToken(access);
        if (refresh) {
          await saveSecureValue('refresh_token', refresh);
        }

        processQueue(null, access);
        return access;
      } catch (refreshError) {
        processQueue(refreshError, null);
        getAuthStore().logout();
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

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, { params }).then((res) => res.data),
  post: <T>(url: string, data?: unknown) =>
    apiClient.post<T>(url, data).then((res) => res.data),
  put: <T>(url: string, data?: unknown) =>
    apiClient.put<T>(url, data).then((res) => res.data),
  patch: <T>(url: string, data?: unknown) =>
    apiClient.patch<T>(url, data).then((res) => res.data),
  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((res) => res.data),
};
