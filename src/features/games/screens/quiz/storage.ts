import { mmkvStorage } from "@/lib/storage";
import { GAME_STORAGE_KEYS } from "@/features/games/constants/storageKeys";
import { logger } from "@/utils/logger";

const KEYS = GAME_STORAGE_KEYS.quiz;

export function loadUnlocked(): number {
  return mmkvStorage.getNumber(KEYS.unlocked) ?? 1;
}

export function saveUnlocked(n: number): void {
  mmkvStorage.setNumber(KEYS.unlocked, n);
}

export function loadCompleted(): Set<number> {
  const raw = mmkvStorage.getString(KEYS.completed);
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw) as number[]);
  } catch (err) {
    logger.warn("[quiz] completed levels parse failed", err);
    return new Set();
  }
}

export function saveCompleted(s: Set<number>): void {
  mmkvStorage.setString(KEYS.completed, JSON.stringify([...s]));
}

export function loadHighScores(): Record<number, number> {
  const raw = mmkvStorage.getString(KEYS.highScores);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<number, number>;
  } catch (err) {
    logger.warn("[quiz] high scores parse failed", err);
    return {};
  }
}

export function saveHighScores(scores: Record<number, number>): void {
  mmkvStorage.setString(KEYS.highScores, JSON.stringify(scores));
}
