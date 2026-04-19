import type { LevelData, WordData } from "@/features/games/data/crosswordLevels";
import type { CellInfo, LetterTile } from "./types";

const DISTRACTOR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function buildGrid(level: LevelData): Map<string, CellInfo> {
  const map = new Map<string, CellInfo>();
  level.words.forEach((w, wi) => {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.direction === "across" ? w.row : w.row + i;
      const c = w.direction === "across" ? w.col + i : w.col;
      const k = `${r}-${c}`;
      const existing = map.get(k);
      if (existing) existing.wordIndices.push(wi);
      else map.set(k, { letter: w.word[i]!, wordIndices: [wi] });
    }
  });
  return map;
}

export function getWordKeys(word: WordData): Set<string> {
  const keys = new Set<string>();
  for (let i = 0; i < word.word.length; i++) {
    const r = word.direction === "across" ? word.row : word.row + i;
    const c = word.direction === "across" ? word.col + i : word.col;
    keys.add(`${r}-${c}`);
  }
  return keys;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // i and j are both in [0, a.length), swap is safe.
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

export function makeBank(word: string): LetterTile[] {
  const unique = new Set(word.split(""));
  const distractors = shuffle(
    DISTRACTOR_POOL.split("").filter((c) => !unique.has(c)),
  ).slice(0, Math.min(3, 12 - word.length));
  return shuffle([...word.split(""), ...distractors]).map((letter, i) => ({
    id: `${i}-${letter}-${Math.random().toString(36).slice(2, 6)}`,
    letter,
    used: false,
  }));
}
