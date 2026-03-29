const ENV_API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!ENV_API_URL && !__DEV__) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL is required in production');
}

export const API_BASE_URL = ENV_API_URL ?? (__DEV__ ? 'http://localhost:8000/api/v1' : '');
export const API_TIMEOUT = 30000;

export const CACHE_DURATIONS = {
  feed: { staleTime: 30 * 1000, gcTime: 5 * 60 * 1000 },
  profile: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  verseOfDay: { staleTime: 60 * 60 * 1000, gcTime: 24 * 60 * 60 * 1000 },
  bibleVersions: { staleTime: 24 * 60 * 60 * 1000, gcTime: 7 * 24 * 60 * 60 * 1000 },
  bibleContent: { staleTime: 7 * 24 * 60 * 60 * 1000, gcTime: 30 * 24 * 60 * 60 * 1000 },
  segregatedPages: { staleTime: 30 * 60 * 1000, gcTime: 2 * 60 * 60 * 1000 },
  shopProducts: { staleTime: 10 * 60 * 1000, gcTime: 60 * 60 * 1000 },
  notifications: { staleTime: 0, gcTime: 5 * 60 * 1000 },
  unreadCount: { staleTime: 0, gcTime: 60 * 1000 },
} as const;
