export interface LetterTile {
  id: string;
  letter: string;
  used: boolean;
}

export interface CellInfo {
  letter: string;
  wordIndices: number[];
}

export type Feedback = "idle" | "correct" | "wrong";
