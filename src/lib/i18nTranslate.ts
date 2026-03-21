/**
 * Auto-translates i18n locale strings for languages that don't have
 * bundled locale files. Uses the free Google Translate API and caches
 * results in AsyncStorage so each language is only translated once.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translateText } from './translate';

const CACHE_PREFIX = 'i18n_locale_';
const CACHE_VERSION = 1;

/**
 * Translate a flat object of key-value strings.
 * Works on nested objects by flattening → translating → unflattening.
 */
export async function translateLocale(
  source: Record<string, any>,
  targetLang: string,
  sourceLang: string = 'en',
): Promise<Record<string, any>> {
  if (targetLang === sourceLang) return source;

  // Check cache first
  const cacheKey = `${CACHE_PREFIX}v${CACHE_VERSION}_${targetLang}`;
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {}

  // Flatten the nested locale object
  const flat = flatten(source);
  const keys = Object.keys(flat);
  const values = Object.values(flat) as string[];

  // Join all values with a delimiter for batch translation
  const DELIMITER = '\n||||\n';
  const joined = values.join(DELIMITER);

  let translatedJoined: string;
  try {
    translatedJoined = await translateText(joined, targetLang, sourceLang);
  } catch {
    return source; // fallback to English on error
  }

  // Split back and rebuild the object
  const translatedValues = translatedJoined.split(/\s*\|{4}\s*/);
  const translatedFlat: Record<string, string> = {};

  keys.forEach((key, i) => {
    // Use translated value if available, otherwise keep original
    translatedFlat[key] = translatedValues[i]?.trim() || flat[key];
  });

  const result = unflatten(translatedFlat);

  // Cache for future use
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {}

  return result;
}

/** Check if a translated locale is cached for a language. */
export async function getCachedLocale(lang: string): Promise<Record<string, any> | null> {
  try {
    const cacheKey = `${CACHE_PREFIX}v${CACHE_VERSION}_${lang}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

// ── Helpers ──

function flatten(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flatten(obj[key], fullKey));
    } else {
      result[fullKey] = String(obj[key]);
    }
  }
  return result;
}

function unflatten(obj: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = obj[key];
  }
  return result;
}
