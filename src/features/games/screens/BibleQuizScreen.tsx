import React, { useCallback, useState } from "react";
import * as Haptics from "expo-haptics";
import { QUIZ_LEVELS } from "@/features/games/data/quizLevels";
import LevelSelect from "./quiz/LevelSelect";
import StoryView from "./quiz/StoryView";
import QuestionView from "./quiz/QuestionView";
import ResultView from "./quiz/ResultView";
import {
  loadUnlocked,
  saveUnlocked,
  loadCompleted,
  saveCompleted,
  loadHighScores,
  saveHighScores,
} from "./quiz/storage";

type Screen = "levels" | "story" | "quiz" | "result";

export default function BibleQuizScreen() {
  const [screen, setScreen] = useState<Screen>("levels");
  const [levelId, setLevelId] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(() => loadUnlocked());
  const [completedLevels, setCompletedLevels] = useState(() => loadCompleted());
  const [highScores, setHighScores] = useState(() => loadHighScores());

  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // levelId is always a valid 1..QUIZ_LEVELS.length index (clamped on advance).
  const level = QUIZ_LEVELS[levelId - 1]!;

  const startLevel = useCallback((id: number) => {
    setLevelId(id);
    setQuestionIdx(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setShowHint(false);
    setScreen("story");
  }, []);

  const selectAnswer = useCallback(
    (optIdx: number) => {
      if (answered) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelected(optIdx);
      setAnswered(true);

      if (optIdx === level.questions[questionIdx]!.correctIndex) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCorrectCount((p) => p + 1);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
    [answered, level, questionIdx],
  );

  const nextQuestion = useCallback(() => {
    if (questionIdx + 1 < level.questions.length) {
      setQuestionIdx((p) => p + 1);
      setSelected(null);
      setAnswered(false);
      setShowHint(false);
      return;
    }

    setCompletedLevels((p) => {
      const next = new Set([...p, levelId]);
      saveCompleted(next);
      return next;
    });
    if (levelId >= unlockedLevel) {
      const next = Math.min(levelId + 1, QUIZ_LEVELS.length);
      setUnlockedLevel(next);
      saveUnlocked(next);
    }
    setHighScores((p) => {
      const next = { ...p };
      if (next[levelId] === undefined || correctCount > next[levelId]) {
        next[levelId] = correctCount;
      }
      saveHighScores(next);
      return next;
    });
    setScreen("result");
  }, [questionIdx, level, correctCount, levelId, unlockedLevel]);

  if (screen === "levels") {
    return (
      <LevelSelect
        unlockedLevel={unlockedLevel}
        completedLevels={completedLevels}
        highScores={highScores}
        onSelectLevel={startLevel}
      />
    );
  }

  if (screen === "story") {
    return <StoryView level={level} onStart={() => setScreen("quiz")} />;
  }

  if (screen === "result") {
    return (
      <ResultView
        level={level}
        correctCount={correctCount}
        isLastLevel={levelId >= QUIZ_LEVELS.length}
        onNextLevel={() => startLevel(levelId + 1)}
        onPlayAgain={() => startLevel(levelId)}
        onBackToLevels={() => setScreen("levels")}
      />
    );
  }

  return (
    <QuestionView
      level={level}
      levelId={levelId}
      questionIdx={questionIdx}
      selected={selected}
      answered={answered}
      correctCount={correctCount}
      showHint={showHint}
      onSelectAnswer={selectAnswer}
      onNext={nextQuestion}
      onShowHint={() => setShowHint(true)}
    />
  );
}
