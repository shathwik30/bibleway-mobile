import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@/utils/logger";

const cache: Record<string, string> = {};
let initialized = false;

function persist(key: string, value: string): void {
  AsyncStorage.setItem(key, value).catch((err) =>
    logger.error("[storage] setItem failed", key, err),
  );
}

function remove(key: string): void {
  AsyncStorage.removeItem(key).catch((err) =>
    logger.error("[storage] removeItem failed", key, err),
  );
}

export async function initStorage(): Promise<void> {
  if (initialized) return;
  try {
    const keys = await AsyncStorage.getAllKeys();
    const entries = await AsyncStorage.multiGet(keys);
    for (const [key, value] of entries) {
      if (value !== null) cache[key] = value;
    }
  } catch (err) {
    logger.warn("[storage] Failed to initialize from AsyncStorage", err);
  }
  initialized = true;
}

export const mmkvStorage = {
  getString: (key: string): string | undefined => cache[key],
  setString: (key: string, value: string): void => {
    cache[key] = value;
    persist(key, value);
  },
  getBoolean: (key: string): boolean | undefined => {
    const v = cache[key];
    if (v === undefined) return undefined;
    return v === "true";
  },
  setBoolean: (key: string, value: boolean): void => {
    const str = String(value);
    cache[key] = str;
    persist(key, str);
  },
  getNumber: (key: string): number | undefined => {
    const v = cache[key];
    if (v === undefined) return undefined;
    return Number(v);
  },
  setNumber: (key: string, value: number): void => {
    const str = String(value);
    cache[key] = str;
    persist(key, str);
  },
  delete: (key: string): void => {
    delete cache[key];
    remove(key);
  },
  clearAll: (): void => {
    Object.keys(cache).forEach((k) => delete cache[k]);
    AsyncStorage.clear().catch((err) =>
      logger.error("[storage] clear failed", err),
    );
  },
};

export const queryClientStorage = {
  setItem: (key: string, value: string): void => {
    cache[key] = value;
    persist(key, value);
  },
  getItem: (key: string): string | null => cache[key] ?? null,
  removeItem: (key: string): void => {
    delete cache[key];
    remove(key);
  },
};
