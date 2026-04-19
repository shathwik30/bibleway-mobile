jest.mock("@/api/client", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/api/endpoints", () => ({
  ENDPOINTS: {
    auth: {
      logout: "/accounts/logout/",
      refreshToken: "/accounts/token/refresh/",
    },
    profile: {
      me: "/accounts/profile/",
    },
  },
}));

jest.mock("@/lib/secureStorage", () => ({
  getSecureValue: jest.fn(),
  saveSecureValue: jest.fn(),
  deleteSecureValue: jest.fn(),
}));

jest.mock("@/lib/storage", () => {
  const store: Record<string, string> = {};
  return {
    mmkvStorage: {
      getString: jest.fn((key: string) => store[key]),
      setString: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      getBoolean: jest.fn((key: string) => {
        const v = store[key];
        if (v === undefined) return undefined;
        return v === "true";
      }),
      setBoolean: jest.fn((key: string, value: boolean) => {
        store[key] = String(value);
      }),
      delete: jest.fn((key: string) => {
        delete store[key];
      }),
      clearAll: jest.fn(),
    },
  };
});

jest.mock("@/lib/pushNotifications", () => ({
  deregisterPushNotifications: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/firebase", () => ({
  signInWithGoogle: jest.fn(),
  getFirebaseIdToken: jest.fn(),
  firebaseSignOut: jest.fn().mockResolvedValue(undefined),
}));

import { useAuthStore } from "../authStore";
import { api } from "@/api/client";
import {
  getSecureValue,
  saveSecureValue,
  deleteSecureValue,
} from "@/lib/secureStorage";
import type { UserProfile } from "@/types/models";

const mockApi = api as jest.Mocked<typeof api>;
const mockGetSecure = getSecureValue as jest.MockedFunction<
  typeof getSecureValue
>;
const mockSaveSecure = saveSecureValue as jest.MockedFunction<
  typeof saveSecureValue
>;
const mockDeleteSecure = deleteSecureValue as jest.MockedFunction<
  typeof deleteSecureValue
>;

const fakeUser: UserProfile = {
  id: "u1",
  email: "test@example.com",
  full_name: "Test User",
  date_of_birth: "1990-01-01",
  gender: "male",
  preferred_language: "en",
  country: "US",
  phone_number: "+1234567890",
  profile_photo: null,
  bio: "A test user",
  is_email_verified: true,
  date_joined: "2024-01-01",
  age: 34,
  follower_count: 10,
  following_count: 5,
  post_count: 3,
  prayer_count: 2,
};

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
      biometricEnabled: false,
    });
    jest.clearAllMocks();
  });

  describe("setAccessToken", () => {
    it("sets the access token in state", () => {
      useAuthStore.getState().setAccessToken("tok_abc");
      expect(useAuthStore.getState().accessToken).toBe("tok_abc");
    });

    it("overwrites an existing token", () => {
      useAuthStore.getState().setAccessToken("tok_old");
      useAuthStore.getState().setAccessToken("tok_new");
      expect(useAuthStore.getState().accessToken).toBe("tok_new");
    });
  });

  describe("setUser", () => {
    it("sets the user profile in state", () => {
      useAuthStore.getState().setUser(fakeUser);
      expect(useAuthStore.getState().user).toEqual(fakeUser);
    });

    it("replaces a previously set user", () => {
      useAuthStore.getState().setUser(fakeUser);
      const updatedUser = { ...fakeUser, full_name: "Updated Name" };
      useAuthStore.getState().setUser(updatedUser);
      expect(useAuthStore.getState().user?.full_name).toBe("Updated Name");
    });
  });

  describe("logout", () => {
    it("clears access token, user, and sets isAuthenticated to false", async () => {
      useAuthStore.setState({
        accessToken: "tok_abc",
        user: fakeUser,
        isAuthenticated: true,
      });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("deletes the refresh token from secure storage", async () => {
      useAuthStore.setState({ accessToken: "tok_abc" });
      mockGetSecure.mockResolvedValueOnce("refresh_tok");

      await useAuthStore.getState().logout();

      expect(mockDeleteSecure).toHaveBeenCalledWith("refresh_token");
    });

    it("calls the server logout endpoint when token and refresh exist", async () => {
      useAuthStore.setState({ accessToken: "tok_abc" });
      mockGetSecure.mockResolvedValueOnce("refresh_tok");

      await useAuthStore.getState().logout();

      expect(mockApi.post).toHaveBeenCalledWith("/accounts/logout/", {
        refresh: "refresh_tok",
      });
    });

    it("does not call server logout when no access token", async () => {
      useAuthStore.setState({ accessToken: null });

      await useAuthStore.getState().logout();

      expect(mockApi.post).not.toHaveBeenCalled();
    });

    it("still clears state when server logout fails", async () => {
      useAuthStore.setState({ accessToken: "tok_abc" });
      mockGetSecure.mockResolvedValueOnce("refresh_tok");
      mockApi.post.mockRejectedValueOnce(new Error("network error"));

      await useAuthStore.getState().logout();

      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe("bootstrap", () => {
    it("sets isLoading to false when no refresh token exists", async () => {
      mockGetSecure.mockResolvedValueOnce(null);

      await useAuthStore.getState().bootstrap();

      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("refreshes tokens and loads profile when refresh token exists", async () => {
      mockGetSecure.mockResolvedValueOnce("old_refresh");
      mockApi.post.mockResolvedValueOnce({
        access: "new_access",
        refresh: "new_refresh",
      });
      mockApi.get.mockResolvedValueOnce(fakeUser);

      await useAuthStore.getState().bootstrap();

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe("new_access");
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(fakeUser);
      expect(state.isLoading).toBe(false);
    });

    it("saves the new refresh token to secure storage", async () => {
      mockGetSecure.mockResolvedValueOnce("old_refresh");
      mockApi.post.mockResolvedValueOnce({
        access: "new_access",
        refresh: "new_refresh",
      });
      mockApi.get.mockResolvedValueOnce(fakeUser);

      await useAuthStore.getState().bootstrap();

      expect(mockSaveSecure).toHaveBeenCalledWith(
        "refresh_token",
        "new_refresh",
      );
    });

    it("clears state and deletes token when token refresh fails", async () => {
      mockGetSecure.mockResolvedValueOnce("old_refresh");
      mockApi.post.mockRejectedValueOnce(new Error("expired"));

      await useAuthStore.getState().bootstrap();

      const state = useAuthStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(mockDeleteSecure).toHaveBeenCalledWith("refresh_token");
    });

    it("clears state when profile fetch fails", async () => {
      mockGetSecure.mockResolvedValueOnce("old_refresh");
      mockApi.post.mockResolvedValueOnce({
        access: "new_access",
        refresh: "new_refresh",
      });
      mockApi.get.mockRejectedValueOnce(new Error("profile fetch failed"));

      await useAuthStore.getState().bootstrap();

      const state = useAuthStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });
});
