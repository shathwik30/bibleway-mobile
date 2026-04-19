import React, { useCallback, useState } from "react";
import { useWindowDimensions } from "react-native";
import { LEVELS } from "@/features/games/data/crosswordLevels";
import LevelSelect from "./crossword/LevelSelect";
import LevelComplete from "./crossword/LevelComplete";
import GameView from "./crossword/GameView";
import {
  loadUnlockedLevel,
  saveUnlockedLevel,
  loadCompletedLevels,
  saveCompletedLevels,
} from "./crossword/storage";

type Screen = "levels" | "game" | "complete";

export default function BibleCrosswordScreen() {
  const { width: SW } = useWindowDimensions();
  const [screen, setScreen] = useState<Screen>("levels");
  const [levelId, setLevelId] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(() => loadUnlockedLevel());
  const [completedLevels, setCompletedLevels] = useState(() =>
    loadCompletedLevels(),
  );
  const [lastScore, setLastScore] = useState(0);

  // levelId is always a valid 1..LEVELS.length index (clamped on advance).
  const level = LEVELS[levelId - 1]!;

  const startLevel = useCallback((id: number) => {
    setLevelId(id);
    setLastScore(0);
    setScreen("game");
  }, []);

  const handleLevelComplete = useCallback(
    (finalScore: number) => {
      setLastScore(finalScore);
      setCompletedLevels((p) => {
        const next = new Set([...p, levelId]);
        saveCompletedLevels(next);
        return next;
      });
      if (levelId >= unlockedLevel) {
        const next = Math.min(levelId + 1, LEVELS.length);
        setUnlockedLevel(next);
        saveUnlockedLevel(next);
      }
      setScreen("complete");
    },
    [levelId, unlockedLevel],
  );

  if (screen === "levels") {
    return (
      <LevelSelect
        unlockedLevel={unlockedLevel}
        completedLevels={completedLevels}
        onSelectLevel={startLevel}
      />
    );
  }

  if (screen === "complete") {
    return (
      <LevelComplete
        level={level}
        score={lastScore}
        isLastLevel={levelId >= LEVELS.length}
        onNext={() => startLevel(levelId + 1)}
        onReplay={() => startLevel(levelId)}
        onLevels={() => setScreen("levels")}
        screenWidth={SW}
      />
    );
  }

  return (
    <GameView
      level={level}
      levelId={levelId}
      onLevelComplete={handleLevelComplete}
    />
  );
}
