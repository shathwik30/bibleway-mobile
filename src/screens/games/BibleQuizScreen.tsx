import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import Animated, {
  ZoomIn,
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { QUIZ_LEVELS, type QuizLevel } from '@/constants/quizLevels';
import { mmkvStorage } from '@/lib/storage';

// ─── Storage ─────────────────────────────────────────────────────
const STORAGE_UNLOCKED = 'quiz_unlocked_level';
const STORAGE_COMPLETED = 'quiz_completed_levels';
const STORAGE_HIGH_SCORES = 'quiz_high_scores';

function loadUnlocked(): number {
  return mmkvStorage.getNumber(STORAGE_UNLOCKED) ?? 1;
}
function saveUnlocked(n: number) {
  mmkvStorage.setNumber(STORAGE_UNLOCKED, n);
}
function loadCompleted(): Set<number> {
  const raw = mmkvStorage.getString(STORAGE_COMPLETED);
  if (!raw) return new Set();
  try { return new Set(JSON.parse(raw) as number[]); } catch { return new Set(); }
}
function saveCompleted(s: Set<number>) {
  mmkvStorage.setString(STORAGE_COMPLETED, JSON.stringify([...s]));
}
function loadHighScores(): Record<number, number> {
  const raw = mmkvStorage.getString(STORAGE_HIGH_SCORES);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}
function saveHighScores(scores: Record<number, number>) {
  mmkvStorage.setString(STORAGE_HIGH_SCORES, JSON.stringify(scores));
}

// ─── Level Select ────────────────────────────────────────────────
function LevelSelect({
  unlockedLevel,
  completedLevels,
  highScores,
  onSelectLevel,
}: {
  unlockedLevel: number;
  completedLevels: Set<number>;
  highScores: Record<number, number>;
  onSelectLevel: (id: number) => void;
}) {
  return (
    <SafeAreaScreen>
      <ScreenHeader title="Bible Quiz" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm text-textSecondary text-center mb-4">
          Journey through 30 Bible stories from Creation to the Great Commission
        </Text>

        {QUIZ_LEVELS.map((level, i) => {
          const locked = level.id > unlockedLevel;
          const completed = completedLevels.has(level.id);
          const best = highScores[level.id];

          return (
            <Animated.View key={level.id} entering={FadeInDown.delay(i * 50).springify()}>
              <Pressable
                onPress={() => !locked && onSelectLevel(level.id)}
                disabled={locked}
                style={{ opacity: locked ? 0.4 : 1, marginBottom: 10 }}
                className="flex-row items-center bg-surface rounded-2xl p-4 border border-border"
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    borderWidth: 2,
                    borderColor: completed ? '#22C55E' : locked ? '#D1D5DB' : '#4A6FA5',
                    backgroundColor: completed ? '#ECFDF5' : '#FFFFFF',
                  }}
                  className="items-center justify-center mr-3"
                >
                  {completed ? (
                    <Ionicons name="checkmark" size={22} color="#22C55E" />
                  ) : locked ? (
                    <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                  ) : (
                    <Text className="text-base font-bold text-primary">{level.id}</Text>
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-base font-bold text-textPrimary">{level.theme}</Text>
                  <Text className="text-xs text-textSecondary mt-0.5">
                    {level.title} · {level.questions.length} questions
                  </Text>
                </View>

                {best !== undefined && (
                  <View className="flex-row items-center mr-2">
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text className="text-xs font-bold text-textSecondary ml-1">{best}/{level.questions.length}</Text>
                  </View>
                )}

                {!locked && (
                  <View
                    style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: completed ? '#ECFDF5' : '#EFF6FF' }}
                    className="items-center justify-center"
                  >
                    <Ionicons name={completed ? 'refresh' : 'play'} size={16} color={completed ? '#22C55E' : '#4A6FA5'} />
                  </View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaScreen>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export default function BibleQuizScreen() {
  const navigation = useNavigation();
  const { width: SW } = useWindowDimensions();

  const [screen, setScreen] = useState<'levels' | 'story' | 'quiz' | 'result'>('levels');
  const [levelId, setLevelId] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(() => loadUnlocked());
  const [completedLevels, setCompletedLevels] = useState(() => loadCompleted());
  const [highScores, setHighScores] = useState(() => loadHighScores());

  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const level = QUIZ_LEVELS[levelId - 1];
  const question = level.questions[questionIdx];

  const startLevel = useCallback((id: number) => {
    setLevelId(id);
    setQuestionIdx(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setShowHint(false);
    setScreen('story');
  }, []);

  const selectAnswer = useCallback(
    (optIdx: number) => {
      if (answered) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelected(optIdx);
      setAnswered(true);

      if (optIdx === question.correctIndex) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCorrectCount((p) => p + 1);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        shakeX.value = withSequence(
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(-6, { duration: 50 }),
          withTiming(6, { duration: 50 }),
          withTiming(0, { duration: 50 }),
        );
      }
    },
    [answered, question],
  );

  const nextQuestion = useCallback(() => {
    if (questionIdx + 1 < level.questions.length) {
      setQuestionIdx((p) => p + 1);
      setSelected(null);
      setAnswered(false);
      setShowHint(false);
    } else {
      // Level complete
      const finalCorrect = correctCount;
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
        if (!next[levelId] || finalCorrect > next[levelId]) {
          next[levelId] = finalCorrect;
        }
        saveHighScores(next);
        return next;
      });
      setScreen('result');
    }
  }, [questionIdx, level, correctCount, levelId, unlockedLevel]);

  // ── Level Select ──────────────────────────────────────────
  if (screen === 'levels') {
    return (
      <LevelSelect
        unlockedLevel={unlockedLevel}
        completedLevels={completedLevels}
        highScores={highScores}
        onSelectLevel={startLevel}
      />
    );
  }

  // ── Story Screen ──────────────────────────────────────────
  if (screen === 'story') {
    return (
      <SafeAreaScreen>
        <ScreenHeader title={level.theme} />
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-primary/5 rounded-2xl p-5 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="book-outline" size={18} color="#4A6FA5" />
              <Text className="text-sm font-bold text-primary ml-2">Story</Text>
            </View>
            <Text className="text-base text-textPrimary leading-7">{level.story}</Text>
          </View>

          <Pressable
            onPress={() => setScreen('quiz')}
            className="bg-primary rounded-2xl py-4 items-center"
          >
            <Text className="text-white font-bold text-base">Start Quiz</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaScreen>
    );
  }

  // ── Result Screen ─────────────────────────────────────────
  if (screen === 'result') {
    const stars = correctCount >= level.questions.length ? 3 : correctCount >= 3 ? 2 : 1;
    const isLastLevel = levelId >= QUIZ_LEVELS.length;

    return (
      <SafeAreaScreen>
        <ScreenHeader title={level.theme} showBack={false} />
        <View className="flex-1 items-center justify-center px-8">
          <Animated.View entering={ZoomIn.springify()} className="items-center">
            <View className="w-20 h-20 rounded-full bg-highlight-green items-center justify-center mb-4">
              <Ionicons name="ribbon" size={40} color="#22C55E" />
            </View>

            <Text className="text-xl font-bold text-textPrimary mb-1">Quiz Complete!</Text>
            <Text className="text-sm text-textSecondary mb-5">{level.theme}</Text>

            <View className="flex-row items-center mb-5">
              {[1, 2, 3].map((n) => (
                <Ionicons
                  key={n}
                  name={n <= stars ? 'star' : 'star-outline'}
                  size={34}
                  color="#F59E0B"
                  style={{ marginHorizontal: 4 }}
                />
              ))}
            </View>

            <View className="bg-surface rounded-2xl px-10 py-5 items-center mb-8 border border-border">
              <Text className="text-4xl font-bold text-primary">
                {correctCount}/{level.questions.length}
              </Text>
              <Text className="text-xs text-textSecondary font-semibold mt-1">Correct Answers</Text>
            </View>

            {!isLastLevel && (
              <Pressable
                onPress={() => startLevel(levelId + 1)}
                className="bg-primary rounded-2xl py-4 mb-3 flex-row items-center justify-center"
                style={{ width: SW - 80, gap: 8 }}
              >
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                <Text className="text-white font-bold text-base">Next Level</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => startLevel(levelId)}
              className="rounded-2xl py-4 mb-3 border border-border flex-row items-center justify-center"
              style={{ width: SW - 80, gap: 8 }}
            >
              <Ionicons name="refresh-outline" size={18} color="#6B7280" />
              <Text className="text-textSecondary font-semibold">Play Again</Text>
            </Pressable>

            <Pressable onPress={() => setScreen('levels')} className="py-3">
              <Text className="text-primary font-semibold">All Levels</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaScreen>
    );
  }

  // ── Quiz Screen ───────────────────────────────────────────
  const getOptionStyle = (optIdx: number) => {
    if (!answered) {
      return selected === optIdx
        ? 'border-primary bg-primary/5'
        : 'border-border bg-white';
    }
    if (optIdx === question.correctIndex) return 'border-success bg-highlight-green';
    if (optIdx === selected) return 'border-error bg-red-50';
    return 'border-border bg-white';
  };

  const getOptionIcon = (optIdx: number) => {
    if (!answered) return null;
    if (optIdx === question.correctIndex)
      return <Ionicons name="checkmark-circle" size={22} color="#22C55E" />;
    if (optIdx === selected)
      return <Ionicons name="close-circle" size={22} color="#EF4444" />;
    return null;
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader
        title={level.theme}
        rightAction={
          <Text className="text-sm font-bold text-textSecondary">
            {questionIdx + 1}/{level.questions.length}
          </Text>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar */}
        <View className="px-4 py-3">
          <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${((questionIdx + (answered ? 1 : 0)) / level.questions.length) * 100}%` }}
            />
          </View>
        </View>

        {/* Question */}
        <Animated.View
          key={`q-${levelId}-${questionIdx}`}
          entering={FadeInDown.duration(300).springify()}
          className="px-5 mb-5"
        >
          <Text className="text-lg font-bold text-textPrimary leading-7">
            {question.question}
          </Text>
        </Animated.View>

        {/* Options */}
        <Animated.View style={shakeStyle} className="px-4">
          {question.options.map((opt, i) => (
            <Animated.View
              key={`${levelId}-${questionIdx}-${i}`}
              entering={FadeInDown.delay(i * 60).springify()}
            >
              <Pressable
                onPress={() => selectAnswer(i)}
                disabled={answered}
                className={`flex-row items-center p-4 rounded-2xl border-2 mb-3 ${getOptionStyle(i)}`}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: answered && i === question.correctIndex ? '#22C55E' : answered && i === selected ? '#EF4444' : '#D1D5DB',
                    backgroundColor: answered && i === question.correctIndex ? '#ECFDF5' : answered && i === selected ? '#FEF2F2' : '#FFFFFF',
                  }}
                  className="items-center justify-center mr-3"
                >
                  <Text
                    className="text-xs font-bold"
                    style={{
                      color: answered && i === question.correctIndex ? '#22C55E' : answered && i === selected ? '#EF4444' : '#6B7280',
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text className="flex-1 text-sm text-textPrimary leading-5">{opt}</Text>
                {getOptionIcon(i)}
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Hint */}
        {!answered && !showHint && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowHint(true);
            }}
            className="mx-4 mt-2 flex-row items-center justify-center py-3 rounded-2xl bg-highlight-yellow border border-yellow-200"
            style={{ gap: 6 }}
          >
            <Ionicons name="bulb-outline" size={18} color="#D97706" />
            <Text className="text-sm font-semibold text-yellow-700">Show Hint</Text>
          </Pressable>
        )}

        {showHint && !answered && (
          <Animated.View entering={FadeIn.duration(200)} className="mx-4 mt-2 bg-highlight-yellow/50 rounded-2xl p-4">
            <View className="flex-row items-center mb-1" style={{ gap: 6 }}>
              <Ionicons name="bulb" size={16} color="#D97706" />
              <Text className="text-xs font-bold text-yellow-700">HINT</Text>
            </View>
            <Text className="text-sm text-yellow-800">{question.hint}</Text>
          </Animated.View>
        )}

        {/* Next / Continue button */}
        {answered && (
          <Animated.View entering={FadeIn.delay(300)} className="px-4 mt-5">
            <Pressable
              onPress={nextQuestion}
              className="bg-primary rounded-2xl py-4 items-center"
            >
              <Text className="text-white font-bold text-base">
                {questionIdx + 1 < level.questions.length ? 'Next Question' : 'See Results'}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaScreen>
  );
}
