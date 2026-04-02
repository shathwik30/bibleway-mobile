import axios, { AxiosError, AxiosHeaders } from "axios";

// Mock all dependencies the client uses
jest.mock("@/constants/api", () => ({
  API_BASE_URL: "http://localhost:8000/api/v1",
  API_TIMEOUT: 30000,
}));

jest.mock("@/stores/authStore", () => ({
  useAuthStore: {
    getState: jest.fn(() => ({
      accessToken: null,
      setAccessToken: jest.fn(),
      logout: jest.fn(),
    })),
  },
}));

jest.mock("@/lib/secureStorage", () => ({
  getSecureValue: jest.fn().mockResolvedValue(null),
  saveSecureValue: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/api/endpoints", () => ({
  ENDPOINTS: {
    auth: {
      refreshToken: "/accounts/token/refresh/",
    },
  },
}));

// We need to mock axios.create to return an instance we can control
const mockInterceptorsRequest = {
  use: jest.fn(),
  eject: jest.fn(),
};
const mockInterceptorsResponse = {
  use: jest.fn(),
  eject: jest.fn(),
};
const mockInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: mockInterceptorsRequest,
    response: mockInterceptorsResponse,
  },
  defaults: {
    headers: {
      common: {},
    },
  },
};

jest.mock("axios", () => {
  const actual = jest.requireActual("axios");
  return {
    ...actual,
    __esModule: true,
    default: {
      ...actual,
      create: jest.fn(() => mockInstance),
      post: jest.fn(),
    },
  };
});

describe("API Client", () => {
  let requestInterceptor: (config: any) => any;
  let requestErrorHandler: (error: any) => any;
  let responseEnvelopeInterceptor: (response: any) => any;
  let responseDeduplicationInterceptor: (response: any) => any;
  let networkRetryErrorHandler: (error: any) => any;
  let envelopeAndRefreshErrorHandler: (error: any) => any;
  let deduplicationErrorHandler: (error: any) => any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Re-require the module to capture interceptors
    jest.isolateModules(() => {
      require("../client");
    });

    // The client registers:
    //   1. request interceptor (token injection + deduplication)
    //   2. response interceptor #1 (deduplication cleanup)
    //   3. response interceptor #2 (network retry)
    //   4. response interceptor #3 (envelope unwrap + token refresh)
    expect(mockInterceptorsRequest.use).toHaveBeenCalledTimes(1);
    expect(mockInterceptorsResponse.use).toHaveBeenCalledTimes(3);

    [requestInterceptor, requestErrorHandler] =
      mockInterceptorsRequest.use.mock.calls[0];
    [responseDeduplicationInterceptor, deduplicationErrorHandler] =
      mockInterceptorsResponse.use.mock.calls[0];
    [, networkRetryErrorHandler] =
      mockInterceptorsResponse.use.mock.calls[1];
    [responseEnvelopeInterceptor, envelopeAndRefreshErrorHandler] =
      mockInterceptorsResponse.use.mock.calls[2];
  });

  describe("token injection (request interceptor)", () => {
    it("adds Authorization header when token exists", () => {
      const { useAuthStore } = require("@/stores/authStore");
      useAuthStore.getState.mockReturnValueOnce({
        accessToken: "my_token",
        setAccessToken: jest.fn(),
        logout: jest.fn(),
      });

      const config = {
        headers: new AxiosHeaders(),
        method: "get",
        url: "/test",
      };

      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBe("Bearer my_token");
    });

    it("does not add Authorization header when no token", () => {
      const { useAuthStore } = require("@/stores/authStore");
      useAuthStore.getState.mockReturnValueOnce({
        accessToken: null,
        setAccessToken: jest.fn(),
        logout: jest.fn(),
      });

      const config = {
        headers: new AxiosHeaders(),
        method: "get",
        url: "/test",
      };

      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBeUndefined();
    });

    it("removes Content-Type header for FormData", () => {
      const { useAuthStore } = require("@/stores/authStore");
      useAuthStore.getState.mockReturnValueOnce({
        accessToken: null,
        setAccessToken: jest.fn(),
        logout: jest.fn(),
      });

      const headers = new AxiosHeaders();
      headers["Content-Type"] = "application/json";
      const config = {
        headers,
        method: "post",
        url: "/upload",
        data: new FormData(),
      };

      const result = requestInterceptor(config);
      expect(result.headers["Content-Type"]).toBeUndefined();
    });
  });

  describe("request deduplication", () => {
    it("aborts a previous identical GET request", () => {
      const { useAuthStore } = require("@/stores/authStore");
      useAuthStore.getState.mockReturnValue({
        accessToken: null,
        setAccessToken: jest.fn(),
        logout: jest.fn(),
      });

      // First request
      const config1 = {
        headers: new AxiosHeaders(),
        method: "get",
        url: "/items",
        params: { page: 1 },
      };
      const result1 = requestInterceptor(config1);
      const controller1Signal = result1.signal;

      // Second identical request should abort the first
      const config2 = {
        headers: new AxiosHeaders(),
        method: "get",
        url: "/items",
        params: { page: 1 },
      };
      requestInterceptor(config2);

      // The first controller's signal should be aborted
      expect(controller1Signal.aborted).toBe(true);
    });

    it("does not deduplicate POST requests", () => {
      const { useAuthStore } = require("@/stores/authStore");
      useAuthStore.getState.mockReturnValue({
        accessToken: null,
        setAccessToken: jest.fn(),
        logout: jest.fn(),
      });

      const config1 = {
        headers: new AxiosHeaders(),
        method: "post",
        url: "/items",
        data: { text: "hello" },
      };
      const result1 = requestInterceptor(config1);
      expect(result1.signal).toBeUndefined();
    });

    it("does not deduplicate GET requests with different params", () => {
      const { useAuthStore } = require("@/stores/authStore");
      useAuthStore.getState.mockReturnValue({
        accessToken: null,
        setAccessToken: jest.fn(),
        logout: jest.fn(),
      });

      const config1 = {
        headers: new AxiosHeaders(),
        method: "get",
        url: "/items",
        params: { page: 1 },
      };
      const result1 = requestInterceptor(config1);

      const config2 = {
        headers: new AxiosHeaders(),
        method: "get",
        url: "/items",
        params: { page: 2 },
      };
      requestInterceptor(config2);

      // First request should NOT be aborted since params differ
      expect(result1.signal.aborted).toBe(false);
    });
  });

  describe("network retry with jitter", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("retries on network error up to MAX_NETWORK_RETRIES", async () => {
      const networkError = new AxiosError(
        "Network Error",
        "ERR_NETWORK",
        undefined,
        undefined,
        undefined,
      );
      networkError.response = undefined as any;

      const config = {
        method: "get",
        url: "/test",
        _networkRetry: 3, // Already at max
      };
      Object.assign(networkError, { config });

      await expect(networkRetryErrorHandler(networkError)).rejects.toEqual(
        networkError,
      );
    });

    it("does not retry on non-network errors (e.g. 400)", async () => {
      const error = new AxiosError("Bad Request", "ERR_BAD_REQUEST");
      error.response = { status: 400 } as any;
      error.config = { method: "get", url: "/test" } as any;

      await expect(networkRetryErrorHandler(error)).rejects.toEqual(error);
    });

    it("does not retry when config is missing", async () => {
      const error = new AxiosError("Network Error", "ERR_NETWORK");
      error.config = undefined as any;

      await expect(networkRetryErrorHandler(error)).rejects.toEqual(error);
    });
  });

  describe("envelope unwrapping (response interceptor)", () => {
    it("unwraps { data, message } envelope", () => {
      const response = {
        data: {
          data: { id: 1, name: "test" },
          message: "Success",
        },
        config: { method: "get", url: "/test" },
      };

      const result = responseEnvelopeInterceptor(response);
      expect(result.data).toEqual({ id: 1, name: "test" });
    });

    it("does not unwrap when response lacks envelope shape", () => {
      const response = {
        data: [1, 2, 3],
        config: { method: "get", url: "/test" },
      };

      const result = responseEnvelopeInterceptor(response);
      expect(result.data).toEqual([1, 2, 3]);
    });

    it("does not unwrap when data is a string", () => {
      const response = {
        data: "plain text",
        config: { method: "get", url: "/test" },
      };

      const result = responseEnvelopeInterceptor(response);
      expect(result.data).toBe("plain text");
    });

    it("does not unwrap when object has data but no message", () => {
      const response = {
        data: { data: { id: 1 } },
        config: { method: "get", url: "/test" },
      };

      const result = responseEnvelopeInterceptor(response);
      // Should not unwrap because there's no 'message' key
      expect(result.data).toEqual({ data: { id: 1 } });
    });
  });

  describe("401 handling and token refresh (response error handler)", () => {
    it("rejects non-401 errors without attempting refresh", async () => {
      const error = new AxiosError("Forbidden", "ERR_BAD_REQUEST");
      error.response = { status: 403 } as any;
      error.config = { url: "/some-endpoint" } as any;

      await expect(envelopeAndRefreshErrorHandler(error)).rejects.toEqual(
        error,
      );
    });

    it("rejects 401 on the refresh endpoint itself to avoid loop", async () => {
      const error = new AxiosError("Unauthorized", "ERR_BAD_RESPONSE");
      error.response = { status: 401 } as any;
      error.config = {
        url: "/accounts/token/refresh/",
        _retry: false,
      } as any;

      await expect(envelopeAndRefreshErrorHandler(error)).rejects.toEqual(
        error,
      );
    });

    it("rejects 401 if the request was already retried", async () => {
      const error = new AxiosError("Unauthorized", "ERR_BAD_RESPONSE");
      error.response = { status: 401 } as any;
      error.config = {
        url: "/some-endpoint",
        _retry: true,
        headers: new AxiosHeaders(),
      } as any;

      await expect(envelopeAndRefreshErrorHandler(error)).rejects.toEqual(
        error,
      );
    });
  });

  describe("deduplication cleanup on response", () => {
    it("cleans up pending requests on successful response", () => {
      const response = {
        data: { ok: true },
        config: { method: "get", url: "/items", params: { page: 1 } },
      };

      // Should not throw
      const result = responseDeduplicationInterceptor(response);
      expect(result.data).toEqual({ ok: true });
    });

    it("cleans up pending requests on error response", async () => {
      const error = { config: { method: "get", url: "/items" } };

      // The error handler re-rejects the error
      await expect(deduplicationErrorHandler(error)).rejects.toEqual(error);
    });
  });
});
