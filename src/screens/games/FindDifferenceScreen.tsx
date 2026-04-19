import React, { useCallback, useState } from "react";
import { FTD_LEVELS } from "@/constants/findDifferenceLevels";
import LevelSelect from "./findDifference/LevelSelect";
import GameView from "./findDifference/GameView";
import ResultView from "./findDifference/ResultView";
import {
  loadUnlocked,
  saveUnlocked,
  loadCompleted,
  saveCompleted,
} from "./findDifference/storage";

type Screen = "levels" | "game" | "result";

export default function FindDifferenceScreen() {
  const [screen, setScreen] = useState<Screen>("levels");
  const [levelId, setLevelId] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(() => loadUnlocked());
  const [completedLevels, setCompletedLevels] = useState(() => loadCompleted());

  // levelId is always a valid 1..FTD_LEVELS.length index (clamped on advance).
  const level = FTD_LEVELS[levelId - 1]!;

  const startLevel = useCallback((id: number) => {
    setLevelId(id);
    setScreen("game");
  }, []);

  const handleSolved = useCallback(() => {
    setCompletedLevels((p) => {
      const next = new Set([...p, levelId]);
      saveCompleted(next);
      return next;
    });
    if (levelId >= unlockedLevel) {
      const next = Math.min(levelId + 1, FTD_LEVELS.length);
      setUnlockedLevel(next);
      saveUnlocked(next);
    }
    setScreen("result");
  }, [levelId, unlockedLevel]);

  if (screen === "levels") {
    return (
      <LevelSelect
        unlockedLevel={unlockedLevel}
        completedLevels={completedLevels}
        onSelectLevel={startLevel}
      />
    );
  }

  if (screen === "result") {
    return (
      <ResultView
        differenceCount={level.correct.length}
        isLastLevel={levelId >= FTD_LEVELS.length}
        onNextLevel={() => startLevel(levelId + 1)}
        onPlayAgain={() => startLevel(levelId)}
        onBackToLevels={() => setScreen("levels")}
      />
    );
  }

  return (
    <GameView
      level={level}
      levelId={levelId}
      onSolved={handleSolved}
      onRetry={() => startLevel(levelId)}
    />
  );
}
