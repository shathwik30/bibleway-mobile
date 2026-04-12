import { mmkvStorage } from "./storage";

export interface GameProgressManager {
  getUnlockedLevel(): number;
  setUnlockedLevel(level: number): void;
  getCompletedLevels(): Set<number>;
  setCompletedLevels(levels: Set<number>): void;
}

/**
 * Factory that creates a game progress manager backed by mmkvStorage.
 *
 * Each game (crossword, quiz, find-the-difference, etc.) passes its own
 * storage key pair so progress is kept separate while sharing the same
 * load/save logic.
 *
 * Usage:
 * ```ts
 * const progress = createGameProgressManager({
 *   unlocked: "crossword_unlocked_level",
 *   completed: "crossword_completed_levels",
 * });
 * const level = progress.getUnlockedLevel(); // defaults to 1
 * ```
 */
export function createGameProgressManager(storageKeys: {
  unlocked: string;
  completed: string;
}): GameProgressManager {
  return {
    getUnlockedLevel() {
      return mmkvStorage.getNumber(storageKeys.unlocked) ?? 1;
    },
    setUnlockedLevel(level: number) {
      mmkvStorage.setNumber(storageKeys.unlocked, level);
    },
    getCompletedLevels() {
      const raw = mmkvStorage.getString(storageKeys.completed);
      if (!raw) return new Set<number>();
      try {
        return new Set(JSON.parse(raw) as number[]);
      } catch {
        return new Set<number>();
      }
    },
    setCompletedLevels(levels: Set<number>) {
      mmkvStorage.setString(storageKeys.completed, JSON.stringify([...levels]));
    },
  };
}
