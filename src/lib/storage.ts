import AsyncStorage from "@react-native-async-storage/async-storage";

const cache: Record<string, string> = {};
let initialized = false;

export async function initStorage(): Promise<void> {
  if (initialized) return;
  try {
    const keys = await AsyncStorage.getAllKeys();
    const entries = await AsyncStorage.multiGet(keys);
    for (const [key, value] of entries) {
      if (value !== null) {
        cache[key] = value;
      }
    }
  } catch (e) {
    console.warn("[storage] Failed to initialize from AsyncStorage", e);
  }
  initialized = true;
}

export const mmkvStorage = {
  getString: (key: string): string | undefined => cache[key],
  setString: (key: string, value: string): void => {
    cache[key] = value;
    AsyncStorage.setItem(key, value).catch(() => {});
  },
  getBoolean: (key: string): boolean | undefined => {
    const v = cache[key];
    if (v === undefined) return undefined;
    return v === "true";
  },
  setBoolean: (key: string, value: boolean): void => {
    cache[key] = String(value);
    AsyncStorage.setItem(key, String(value)).catch(() => {});
  },
  getNumber: (key: string): number | undefined => {
    const v = cache[key];
    if (v === undefined) return undefined;
    return Number(v);
  },
  setNumber: (key: string, value: number): void => {
    cache[key] = String(value);
    AsyncStorage.setItem(key, String(value)).catch(() => {});
  },
  delete: (key: string): void => {
    delete cache[key];
    AsyncStorage.removeItem(key).catch(() => {});
  },
  clearAll: (): void => {
    Object.keys(cache).forEach((k) => delete cache[k]);
    AsyncStorage.clear().catch(() => {});
  },
};

export const queryClientStorage = {
  setItem: (key: string, value: string): void => {
    cache[key] = value;
    AsyncStorage.setItem(key, value).catch(() => {});
  },
  getItem: (key: string): string | null => {
    return cache[key] ?? null;
  },
  removeItem: (key: string): void => {
    delete cache[key];
    AsyncStorage.removeItem(key).catch(() => {});
  },
};
