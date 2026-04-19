import AsyncStorage from "@react-native-async-storage/async-storage";
import { translateText } from "./translate";
import { logger } from "@/utils/logger";

const CACHE_PREFIX = "i18n_locale_";
const CACHE_VERSION = 1;

type LocaleObject = Record<string, string | Record<string, string>>;

export async function translateLocale(
  source: LocaleObject,
  targetLang: string,
  sourceLang: string = "en",
): Promise<LocaleObject> {
  if (targetLang === sourceLang) return source;

  const cacheKey = `${CACHE_PREFIX}v${CACHE_VERSION}_${targetLang}`;
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as LocaleObject;
  } catch (err) {
    logger.debug("[i18n] locale cache read failed", err);
  }

  const flat = flatten(source);
  const keys = Object.keys(flat);
  const values = Object.values(flat);

  const DELIMITER = "\n||||\n";
  const joined = values.join(DELIMITER);

  let translatedJoined: string;
  try {
    translatedJoined = await translateText(joined, targetLang, sourceLang);
  } catch {
    return source;
  }

  const translatedValues = translatedJoined.split(/\s*\|{4}\s*/);
  const translatedFlat: Record<string, string> = {};

  keys.forEach((key, i) => {
    const fallback = flat[key] ?? "";
    translatedFlat[key] = translatedValues[i]?.trim() || fallback;
  });

  const result = unflatten(translatedFlat);

  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
  } catch (err) {
    logger.warn("[i18n] locale cache write failed", err);
  }

  return result;
}

export async function getCachedLocale(
  lang: string,
): Promise<LocaleObject | null> {
  try {
    const cacheKey = `${CACHE_PREFIX}v${CACHE_VERSION}_${lang}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    return cached ? (JSON.parse(cached) as LocaleObject) : null;
  } catch {
    return null;
  }
}

function flatten(obj: LocaleObject, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      Object.assign(result, flatten(value as LocaleObject, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

function unflatten(obj: Record<string, string>): LocaleObject {
  const result: Record<string, string | Record<string, string>> = {};
  for (const key of Object.keys(obj)) {
    const parts = key.split(".");
    let current: Record<string, unknown> = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const segment = parts[i]!;
      if (!current[segment]) current[segment] = {};
      current = current[segment] as Record<string, unknown>;
    }
    const leaf = parts[parts.length - 1]!;
    current[leaf] = obj[key]!;
  }
  return result as LocaleObject;
}
