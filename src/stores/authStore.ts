import { create } from 'zustand';
import { UserProfile } from '@/types/models';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { getSecureValue, saveSecureValue, deleteSecureValue } from '@/lib/secureStorage';
import { mmkvStorage } from '@/lib/storage';
import { AuthTokens } from '@/types/api';

interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;

  setAccessToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  setTokens: (tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
  setBiometricEnabled: (enabled: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  biometricEnabled: mmkvStorage.getBoolean('biometric_enabled') ?? false,

  setAccessToken: (token) => set({ accessToken: token }),

  setUser: (user) => set({ user }),

  setTokens: async (tokens) => {
    set({ accessToken: tokens.access, isAuthenticated: true });
    await saveSecureValue('refresh_token', tokens.refresh);
  },

  logout: async () => {
    const token = get().accessToken;
    if (token) {
      try {
        const refreshToken = await getSecureValue('refresh_token');
        if (refreshToken) {
          await api.post(ENDPOINTS.auth.logout, { refresh: refreshToken });
        }
      } catch {
        // Ignore logout API errors
      }
    }
    await deleteSecureValue('refresh_token');
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  bootstrap: async () => {
    try {
      const refreshToken = await getSecureValue('refresh_token');
      if (!refreshToken) {
        set({ isLoading: false });
        return;
      }

      // Try to get new access token
      const tokens = await api.post<AuthTokens>(
        ENDPOINTS.auth.refreshToken,
        { refresh: refreshToken }
      );

      set({ accessToken: tokens.access, isAuthenticated: true });

      if (tokens.refresh) {
        await saveSecureValue('refresh_token', tokens.refresh);
      }

      // Fetch user profile
      const profile = await api.get<UserProfile>(ENDPOINTS.profile.me);
      set({ user: profile, isLoading: false });
    } catch {
      await deleteSecureValue('refresh_token');
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setBiometricEnabled: (enabled) => {
    mmkvStorage.setBoolean('biometric_enabled', enabled);
    set({ biometricEnabled: enabled });
  },
}));
