import { mmkvStorage } from "@/lib/storage";
import { GAME_STORAGE_KEYS } from "@/constants/games/storageKeys";
import { logger } from "@/utils/logger";

const KEYS = GAME_STORAGE_KEYS.crossword;

export function loadUnlockedLevel(): number {
  return mmkvStorage.getNumber(KEYS.unlocked) ?? 1;
}

export function saveUnlockedLevel(level: number): void {
  mmkvStorage.setNumber(KEYS.unlocked, level);
}

export function loadCompletedLevels(): Set<number> {
  const raw = mmkvStorage.getString(KEYS.completed);
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw) as number[]);
  } catch (err) {
    logger.warn("[crossword] completed levels parse failed", err);
    return new Set();
  }
}

export function saveCompletedLevels(levels: Set<number>): void {
  mmkvStorage.setString(KEYS.completed, JSON.stringify([...levels]));
}
