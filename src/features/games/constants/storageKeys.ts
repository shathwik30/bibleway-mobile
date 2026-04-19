export const GAME_STORAGE_KEYS = {
  crossword: {
    unlocked: "crossword_unlocked_level",
    completed: "crossword_completed_levels",
  },
  quiz: {
    unlocked: "quiz_unlocked_level",
    completed: "quiz_completed_levels",
    highScores: "quiz_high_scores",
  },
  findDifference: {
    unlocked: "ftd_unlocked_level",
    completed: "ftd_completed_levels",
  },
  ticTacToe: {
    scores: "tictactoe_scores",
  },
} as const;

export type GameType = keyof typeof GAME_STORAGE_KEYS;
