import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  ZoomIn,
  FadeInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { LEVELS, type LevelData, type WordData } from '@/constants/crosswordLevels';
import { mmkvStorage } from '@/lib/storage';

// ─── Types ────────────────────────────────────────────────────────
interface LetterTile {
  id: string;
  letter: string;
  used: boolean;
}

interface CellInfo {
  letter: string;
  wordIndices: number[];
}

// ─── Helpers ──────────────────────────────────────────────────────
const DISTRACTOR_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const STORAGE_KEY_UNLOCKED = 'crossword_unlocked_level';
const STORAGE_KEY_COMPLETED = 'crossword_completed_levels';

function loadUnlockedLevel(): number {
  return mmkvStorage.getNumber(STORAGE_KEY_UNLOCKED) ?? 1;
}

function saveUnlockedLevel(level: number) {
  mmkvStorage.setNumber(STORAGE_KEY_UNLOCKED, level);
}

function loadCompletedLevels(): Set<number> {
  const raw = mmkvStorage.getString(STORAGE_KEY_COMPLETED);
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function saveCompletedLevels(levels: Set<number>) {
  mmkvStorage.setString(STORAGE_KEY_COMPLETED, JSON.stringify([...levels]));
}

function buildGrid(level: LevelData) {
  const map = new Map<string, CellInfo>();
  level.words.forEach((w, wi) => {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.direction === 'across' ? w.row : w.row + i;
      const c = w.direction === 'across' ? w.col + i : w.col;
      const k = `${r}-${c}`;
      const ex = map.get(k);
      if (ex) ex.wordIndices.push(wi);
      else map.set(k, { letter: w.word[i], wordIndices: [wi] });
    }
  });
  return map;
}

function getWordKeys(word: WordData) {
  const keys = new Set<string>();
  for (let i = 0; i < word.word.length; i++) {
    const r = word.direction === 'across' ? word.row : word.row + i;
    const c = word.direction === 'across' ? word.col + i : word.col;
    keys.add(`${r}-${c}`);
  }
  return keys;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeBank(word: string): LetterTile[] {
  const unique = new Set(word.split(''));
  const distractors = shuffle(
    DISTRACTOR_POOL.split('').filter((c) => !unique.has(c)),
  ).slice(0, Math.min(3, 12 - word.length));
  return shuffle([...word.split(''), ...distractors]).map((letter, i) => ({
    id: `${i}-${letter}-${Math.random().toString(36).slice(2, 6)}`,
    letter,
    used: false,
  }));
}

// ─── Level Select ────────────────────────────────────────────────
function LevelSelect({
  unlockedLevel,
  completedLevels,
  onSelectLevel,
}: {
  unlockedLevel: number;
  completedLevels: Set<number>;
  onSelectLevel: (id: number) => void;
}) {
  const navigation = useNavigation();

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Bible Crossword" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm text-textSecondary text-center mb-4">
          Solve crossword puzzles across 10 biblical themes
        </Text>

        {LEVELS.map((level, i) => {
          const locked = level.id > unlockedLevel;
          const completed = completedLevels.has(level.id);

          return (
            <Animated.View key={level.id} entering={FadeInDown.delay(i * 50).springify()}>
              <Pressable
                onPress={() => !locked && onSelectLevel(level.id)}
                disabled={locked}
                style={{ opacity: locked ? 0.4 : 1, marginBottom: 10 }}
                className="flex-row items-center bg-surface rounded-2xl p-4 border border-border"
              >
                {/* Number / Status */}
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

                {/* Info */}
                <View className="flex-1">
                  <Text className="text-base font-bold text-textPrimary">{level.theme}</Text>
                  <Text className="text-xs text-textSecondary mt-0.5">
                    {level.title} · {level.words.length} words
                  </Text>
                </View>

                {/* Play button */}
                {!locked && (
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: completed ? '#ECFDF5' : '#EFF6FF',
                    }}
                    className="items-center justify-center"
                  >
                    <Ionicons
                      name={completed ? 'refresh' : 'play'}
                      size={16}
                      color={completed ? '#22C55E' : '#4A6FA5'}
                    />
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

// ─── Level Complete ──────────────────────────────────────────────
function LevelCompleteScreen({
  level,
  score,
  isLastLevel,
  onNext,
  onReplay,
  onLevels,
  screenWidth,
}: {
  level: LevelData;
  score: number;
  isLastLevel: boolean;
  onNext: () => void;
  onReplay: () => void;
  onLevels: () => void;
  screenWidth: number;
}) {
  const stars = score >= level.words.length * 80 ? 3 : score >= level.words.length * 50 ? 2 : 1;

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Bible Crossword" showBack={false} />
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View entering={ZoomIn.springify()} className="items-center">
          <View className="w-20 h-20 rounded-full bg-highlight-green items-center justify-center mb-4">
            <Ionicons name="trophy" size={40} color="#22C55E" />
          </View>

          <Text className="text-xl font-bold text-textPrimary mb-1">{level.theme}</Text>
          <Text className="text-sm text-textSecondary mb-5">Level Complete!</Text>

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

          {/* Stats */}
          <View
            className="flex-row items-center bg-surface rounded-2xl border border-border mb-8"
            style={{ width: screenWidth - 80 }}
          >
            <View className="flex-1 items-center py-4">
              <Ionicons name="trophy-outline" size={20} color="#F59E0B" />
              <Text className="text-xl font-bold text-textPrimary mt-1">{score}</Text>
              <Text className="text-xs text-textSecondary">Points</Text>
            </View>
            <View style={{ width: 1, height: 40 }} className="bg-border" />
            <View className="flex-1 items-center py-4">
              <Ionicons name="checkmark-circle-outline" size={20} color="#22C55E" />
              <Text className="text-xl font-bold text-textPrimary mt-1">
                {level.words.length}/{level.words.length}
              </Text>
              <Text className="text-xs text-textSecondary">Solved</Text>
            </View>
          </View>

          {/* Actions */}
          {!isLastLevel && (
            <Pressable
              onPress={onNext}
              className="bg-primary rounded-2xl py-4 mb-3 flex-row items-center justify-center"
              style={{ width: screenWidth - 80, gap: 8 }}
            >
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              <Text className="text-white font-bold text-base">Next Level</Text>
            </Pressable>
          )}

          <Pressable
            onPress={onReplay}
            className="rounded-2xl py-4 mb-3 border border-border flex-row items-center justify-center"
            style={{ width: screenWidth - 80, gap: 8 }}
          >
            <Ionicons name="refresh-outline" size={18} color="#6B7280" />
            <Text className="text-textSecondary font-semibold">Play Again</Text>
          </Pressable>

          <Pressable onPress={onLevels} className="py-3">
            <Text className="text-primary font-semibold">All Levels</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaScreen>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export default function BibleCrosswordScreen() {
  const navigation = useNavigation();
  const { width: SW } = useWindowDimensions();

  // ── Screen state ──────────────────────────────────────────
  const [screen, setScreen] = useState<'levels' | 'game' | 'complete'>('levels');
  const [levelId, setLevelId] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(() => loadUnlockedLevel());
  const [completedLevels, setCompletedLevels] = useState(() => loadCompletedLevels());

  // ── Game state ────────────────────────────────────────────
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [wordIdx, setWordIdx] = useState(0);
  const [input, setInput] = useState<string[]>([]);
  const [bank, setBank] = useState<LetterTile[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState(0);

  const shakeX = useSharedValue(0);
  const popScale = useSharedValue(1);

  const level = LEVELS[levelId - 1];
  const gridMap = useMemo(() => buildGrid(level), [levelId]);
  const word = level.words[wordIdx];
  const currKeys = useMemo(() => getWordKeys(word), [levelId, wordIdx]);

  const CELL_GAP = 2;
  const CELL = Math.min(
    Math.floor((SW - 48 - CELL_GAP * (level.gridSize - 1)) / level.gridSize),
    40,
  );
  const GRID_PX = CELL * level.gridSize + CELL_GAP * (level.gridSize - 1) + 8;

  useEffect(() => {
    setBank(makeBank(word.word));
    setInput([]);
    setFeedback('idle');
    setHints(0);
  }, [wordIdx, levelId]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));
  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: popScale.value }],
  }));

  // ── Actions ───────────────────────────────────────────────
  const startLevel = useCallback((id: number) => {
    setLevelId(id);
    setSolved(new Set());
    setWordIdx(0);
    setScore(0);
    setHints(0);
    setFeedback('idle');
    setScreen('game');
  }, []);

  const selectNextUnsolved = useCallback(
    (currentSolved: Set<number>) => {
      const lvl = LEVELS[levelId - 1];
      for (let i = 0; i < lvl.words.length; i++) {
        if (!currentSolved.has(i)) {
          setWordIdx(i);
          return;
        }
      }
    },
    [levelId],
  );

  const tap = useCallback(
    (id: string, letter: string) => {
      if (input.length >= word.word.length) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setInput((p) => [...p, letter]);
      setBank((p) => p.map((t) => (t.id === id ? { ...t, used: true } : t)));
    },
    [input.length, word.word.length],
  );

  const del = useCallback(() => {
    if (!input.length) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const last = input[input.length - 1];
    let done = false;
    setBank((p) => {
      const n = [...p];
      for (let i = n.length - 1; i >= 0; i--) {
        if (n[i].used && n[i].letter === last && !done) {
          n[i] = { ...n[i], used: false };
          done = true;
          break;
        }
      }
      return n;
    });
    setInput((p) => p.slice(0, -1));
  }, [input]);

  const clearAll = useCallback(() => {
    if (!input.length) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBank((p) => p.map((t) => ({ ...t, used: false })));
    setInput([]);
  }, [input]);

  const submit = useCallback(() => {
    if (input.length < word.word.length) return;
    if (input.join('') === word.word) {
      setFeedback('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      popScale.value = withSequence(withSpring(1.05), withSpring(1));

      const newSolved = new Set([...solved, wordIdx]);
      setSolved(newSolved);
      setScore((p) => p + Math.max(40, 100 - hints * 20));

      setTimeout(() => {
        if (newSolved.size >= level.words.length) {
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
          setScreen('complete');
        } else {
          selectNextUnsolved(newSolved);
          setFeedback('idle');
        }
      }, 900);
    } else {
      setFeedback('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-10, { duration: 55 }),
        withTiming(10, { duration: 55 }),
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
      setTimeout(() => setFeedback('idle'), 600);
    }
  }, [input, word, wordIdx, level, levelId, hints, solved, unlockedLevel, selectNextUnsolved]);

  const hint = useCallback(() => {
    const next = input.length;
    if (next >= word.word.length || hints >= 2) return;
    const needed = word.word[next];
    const tile = bank.find((t) => !t.used && t.letter === needed);
    if (!tile) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHints((h) => h + 1);
    tap(tile.id, tile.letter);
  }, [input.length, word.word, bank, tap, hints]);

  // ── Screens ───────────────────────────────────────────────
  if (screen === 'levels') {
    return (
      <LevelSelect
        unlockedLevel={unlockedLevel}
        completedLevels={completedLevels}
        onSelectLevel={startLevel}
      />
    );
  }

  if (screen === 'complete') {
    return (
      <LevelCompleteScreen
        level={level}
        score={score}
        isLastLevel={levelId >= LEVELS.length}
        onNext={() => startLevel(levelId + 1)}
        onReplay={() => startLevel(levelId)}
        onLevels={() => setScreen('levels')}
        screenWidth={SW}
      />
    );
  }

  // ── Grid ──────────────────────────────────────────────────
  const renderGrid = () => {
    const rows: React.ReactNode[] = [];
    for (let r = 0; r < level.gridSize; r++) {
      const cells: React.ReactNode[] = [];
      for (let c = 0; c < level.gridSize; c++) {
        const k = `${r}-${c}`;
        const cell = gridMap.get(k);
        const isCur = currKeys.has(k);
        const isDone = cell ? cell.wordIndices.some((idx) => solved.has(idx)) : false;

        if (!cell) {
          cells.push(
            <View
              key={k}
              style={{ width: CELL, height: CELL }}
              className="bg-gray-100"
            />,
          );
        } else {
          cells.push(
            <View
              key={k}
              style={{
                width: CELL,
                height: CELL,
                borderWidth: 1.5,
                borderColor: isDone ? '#22C55E' : isCur ? '#4A6FA5' : '#E5E7EB',
                backgroundColor: isDone ? '#ECFDF5' : isCur ? '#EFF6FF' : '#FFFFFF',
              }}
              className="items-center justify-center"
            >
              {isDone && (
                <Text
                  style={{ fontSize: CELL * 0.4 }}
                  className="font-bold text-textPrimary"
                >
                  {cell.letter}
                </Text>
              )}
            </View>,
          );
        }
      }
      rows.push(
        <View key={r} style={{ flexDirection: 'row', gap: CELL_GAP }}>
          {cells}
        </View>,
      );
    }
    return rows;
  };

  // ── Letter tiles ──────────────────────────────────────────
  const TILE_SIZE = Math.floor((SW - 64 - 4 * 8) / 5);
  const renderLetterBank = () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
      {bank.map((tile) => (
        <Pressable
          key={tile.id}
          disabled={tile.used}
          onPress={() => tap(tile.id, tile.letter)}
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            borderRadius: 12,
            opacity: tile.used ? 0.3 : 1,
          }}
          className={`items-center justify-center ${tile.used ? 'bg-gray-100' : 'bg-primary'}`}
        >
          <Text
            style={{ fontSize: TILE_SIZE * 0.4 }}
            className={`font-bold ${tile.used ? 'text-gray-300' : 'text-white'}`}
          >
            {tile.letter}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  // ── Input boxes ───────────────────────────────────────────
  const boxW = Math.min(42, (SW - 48 - (word.word.length - 1) * 6) / word.word.length);

  // ── Game screen ───────────────────────────────────────────
  return (
    <SafeAreaScreen>
      <ScreenHeader
        title={level.theme}
        rightAction={
          <View className="flex-row items-center bg-surface rounded-full px-3 py-1.5">
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text className="text-sm font-bold text-textPrimary ml-1.5">{score}</Text>
          </View>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar */}
        <View className="flex-row items-center px-4 py-2" style={{ gap: 8 }}>
          <View className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${(solved.size / level.words.length) * 100}%` }}
            />
          </View>
          <Text className="text-xs font-bold text-textSecondary">
            {solved.size}/{level.words.length}
          </Text>
        </View>

        {/* Word selector pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 6, paddingBottom: 8 }}
        >
          {level.words.map((w, i) => {
            const isSolved = solved.has(i);
            const isActive = i === wordIdx;
            return (
              <Pressable
                key={i}
                onPress={() => !isSolved && setWordIdx(i)}
                disabled={isSolved}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderWidth: 1.5,
                  borderColor: isSolved ? '#22C55E' : isActive ? '#4A6FA5' : '#E5E7EB',
                  backgroundColor: isSolved ? '#ECFDF5' : isActive ? '#EFF6FF' : '#FFFFFF',
                  gap: 4,
                }}
              >
                {isSolved && <Ionicons name="checkmark-circle" size={14} color="#22C55E" />}
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: isSolved ? '#22C55E' : isActive ? '#4A6FA5' : '#6B7280',
                  }}
                >
                  {w.word.length} letters · {w.direction}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Crossword grid */}
        <View className="items-center px-4 mb-4">
          <View
            style={{
              width: GRID_PX,
              padding: 4,
              borderRadius: 16,
              gap: CELL_GAP,
            }}
            className="bg-gray-100"
          >
            {renderGrid()}
          </View>
        </View>

        {/* Clue card */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="mx-4 mb-5 bg-surface rounded-2xl p-4"
          key={`clue-${levelId}-${wordIdx}`}
        >
          <View className="flex-row items-center mb-2" style={{ gap: 8 }}>
            <View className="bg-primary rounded-lg px-2.5 py-1">
              <Text className="text-xs font-bold text-white">
                {word.direction === 'across' ? 'ACROSS' : 'DOWN'}
              </Text>
            </View>
            <Text className="text-xs text-textSecondary font-medium">
              {word.word.length} letters
            </Text>
          </View>
          <Text className="text-base text-textPrimary leading-6">{word.hint}</Text>
        </Animated.View>

        {/* Input display */}
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              gap: 6,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              paddingHorizontal: 16,
            },
            shakeStyle,
            popStyle,
          ]}
        >
          {word.word.split('').map((_, i) => {
            const isFilled = !!input[i];
            const borderColor =
              feedback === 'correct'
                ? '#22C55E'
                : feedback === 'wrong'
                  ? '#EF4444'
                  : isFilled
                    ? '#4A6FA5'
                    : '#E5E7EB';
            const bgColor =
              feedback === 'correct'
                ? '#ECFDF5'
                : feedback === 'wrong'
                  ? '#FEF2F2'
                  : isFilled
                    ? '#EFF6FF'
                    : '#FFFFFF';
            return (
              <View
                key={i}
                style={{
                  width: boxW,
                  height: boxW + 4,
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor,
                  backgroundColor: bgColor,
                }}
                className="items-center justify-center"
              >
                {input[i] ? (
                  <Animated.Text
                    entering={ZoomIn.duration(150)}
                    className="text-lg font-bold text-textPrimary"
                  >
                    {input[i]}
                  </Animated.Text>
                ) : (
                  <View
                    style={{ width: 12, height: 2, borderRadius: 1 }}
                    className="bg-gray-200"
                  />
                )}
              </View>
            );
          })}
        </Animated.View>

        {/* Letter bank */}
        <View className="px-6 mb-5">{renderLetterBank()}</View>

        {/* Action buttons */}
        <View className="flex-row px-4 mb-4" style={{ gap: 10 }}>
          <Pressable
            onPress={del}
            className="flex-row items-center justify-center h-12 rounded-2xl bg-surface border border-border"
            style={{ flex: 1, gap: 6 }}
          >
            <Ionicons name="backspace-outline" size={20} color="#6B7280" />
          </Pressable>

          <Pressable
            onPress={clearAll}
            className="flex-row items-center justify-center h-12 rounded-2xl bg-surface border border-border"
            style={{ flex: 1, gap: 6 }}
          >
            <Ionicons name="close-outline" size={20} color="#6B7280" />
            <Text className="text-sm font-semibold text-textSecondary">Clear</Text>
          </Pressable>

          <Pressable
            onPress={hint}
            disabled={hints >= 2}
            className="flex-row items-center justify-center h-12 rounded-2xl bg-highlight-yellow border border-yellow-200"
            style={{ flex: 1, gap: 6, opacity: hints >= 2 ? 0.4 : 1 }}
          >
            <Ionicons name="bulb-outline" size={20} color="#D97706" />
            <Text className="text-sm font-semibold text-yellow-700">Hint</Text>
          </Pressable>
        </View>

        {/* Submit button */}
        <View className="px-4">
          <Pressable
            onPress={submit}
            disabled={input.length < word.word.length}
            style={{ opacity: input.length < word.word.length ? 0.4 : 1 }}
            className="h-14 rounded-2xl bg-primary items-center justify-center"
          >
            <Text className="text-base font-bold text-white tracking-wide">Check Answer</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
