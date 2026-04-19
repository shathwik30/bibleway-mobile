import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { colors } from "@/theme/colors";
import type { LevelData } from "@/constants/crosswordLevels";
import { buildGrid, getWordKeys, makeBank } from "./gridUtils";
import type { Feedback, LetterTile } from "./types";
import GameGrid from "./GameGrid";
import WordSelector from "./WordSelector";
import InputBoxes from "./InputBoxes";
import LetterBank from "./LetterBank";

const HINT_ICON = colors.feedback.hintAccent;
const CELL_GAP = 2;

interface GameViewProps {
  level: LevelData;
  levelId: number;
  onLevelComplete: (finalScore: number) => void;
}

export default function GameView({
  level,
  levelId,
  onLevelComplete,
}: GameViewProps) {
  const { width: SW } = useWindowDimensions();

  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [wordIdx, setWordIdx] = useState(0);
  const [input, setInput] = useState<string[]>([]);
  const [bank, setBank] = useState<LetterTile[]>([]);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState(0);

  const shakeX = useSharedValue(0);
  const popScale = useSharedValue(1);

  const gridMap = useMemo(() => buildGrid(level), [level]);
  // wordIdx is always a valid index into level.words (selectNextUnsolved
  // only advances within bounds, useEffect resets on level change).
  const word = level.words[wordIdx]!;
  const currKeys = useMemo(() => getWordKeys(word), [word]);

  const CELL = Math.min(
    Math.floor((SW - 48 - CELL_GAP * (level.gridSize - 1)) / level.gridSize),
    40,
  );
  const GRID_PX = CELL * level.gridSize + CELL_GAP * (level.gridSize - 1) + 8;
  const TILE_SIZE = Math.floor((SW - 64 - 4 * 8) / 5);
  const boxW = Math.min(
    42,
    (SW - 48 - (word.word.length - 1) * 6) / word.word.length,
  );

  useEffect(() => {
    setBank(makeBank(word.word));
    setInput([]);
    setFeedback("idle");
    setHints(0);
  }, [word]);

  const selectNextUnsolved = useCallback(
    (currentSolved: Set<number>) => {
      for (let i = 0; i < level.words.length; i++) {
        if (!currentSolved.has(i)) {
          setWordIdx(i);
          return;
        }
      }
    },
    [level],
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
    const last = input[input.length - 1]!;
    let done = false;
    setBank((p) => {
      const n = [...p];
      for (let i = n.length - 1; i >= 0; i--) {
        const tile = n[i]!;
        if (tile.used && tile.letter === last && !done) {
          n[i] = { ...tile, used: false };
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
  }, [input.length]);

  const submit = useCallback(() => {
    if (input.length < word.word.length) return;
    if (input.join("") === word.word) {
      setFeedback("correct");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      popScale.value = withSequence(withSpring(1.05), withSpring(1));

      const newSolved = new Set([...solved, wordIdx]);
      setSolved(newSolved);
      const earned = Math.max(40, 100 - hints * 20);
      const nextScore = score + earned;
      setScore(nextScore);

      setTimeout(() => {
        if (newSolved.size >= level.words.length) {
          onLevelComplete(nextScore);
        } else {
          selectNextUnsolved(newSolved);
          setFeedback("idle");
        }
      }, 900);
    } else {
      setFeedback("wrong");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-10, { duration: 55 }),
        withTiming(10, { duration: 55 }),
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
      setTimeout(() => setFeedback("idle"), 600);
    }
  }, [
    input,
    word,
    wordIdx,
    level,
    hints,
    solved,
    score,
    onLevelComplete,
    selectNextUnsolved,
    popScale,
    shakeX,
  ]);

  const progressFillStyle = useMemo(
    () =>
      ({
        width: `${(solved.size / level.words.length) * 100}%` as const,
      }) as const,
    [solved.size, level.words.length],
  );

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

  return (
    <SafeAreaScreen>
      <ScreenHeader
        title={level.theme}
        rightAction={
          <View className="flex-row items-center bg-surface rounded-full px-3 py-1.5">
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text className="text-sm font-bold text-textPrimary ml-1.5">
              {score}
            </Text>
          </View>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center px-4 py-2" style={styles.progressRow}>
          <View className="flex-1 h-1.5 bg-surfaceContainerHigh rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={progressFillStyle}
            />
          </View>
          <Text className="text-xs font-bold text-textSecondary">
            {solved.size}/{level.words.length}
          </Text>
        </View>

        <WordSelector
          words={level.words}
          currentIdx={wordIdx}
          solved={solved}
          onSelect={setWordIdx}
        />

        <View className="items-center px-4 mb-4">
          <View
            style={[styles.gridWrap, { width: GRID_PX }]}
            className="bg-surfaceContainerHigh"
          >
            <GameGrid
              level={level}
              gridMap={gridMap}
              currKeys={currKeys}
              solved={solved}
              cellSize={CELL}
              cellGap={CELL_GAP}
            />
          </View>
        </View>

        <Animated.View
          entering={FadeInDown.duration(300)}
          className="mx-4 mb-5 bg-surface rounded-2xl p-4"
          key={`clue-${levelId}-${wordIdx}`}
        >
          <View className="flex-row items-center mb-2" style={styles.clueRow}>
            <View className="bg-primary rounded-lg px-2.5 py-1">
              <Text className="text-xs font-bold text-white">
                {word.direction === "across" ? "ACROSS" : "DOWN"}
              </Text>
            </View>
            <Text className="text-xs text-textSecondary font-medium">
              {word.word.length} letters
            </Text>
          </View>
          <Text className="text-base text-textPrimary leading-6">
            {word.hint}
          </Text>
        </Animated.View>

        <InputBoxes
          length={word.word.length}
          input={input}
          feedback={feedback}
          boxWidth={boxW}
          shakeX={shakeX}
          popScale={popScale}
        />

        <View className="px-6 mb-5">
          <LetterBank tiles={bank} tileSize={TILE_SIZE} onTap={tap} />
        </View>

        <View className="flex-row px-4 mb-4" style={styles.controls}>
          <Pressable
            onPress={del}
            accessibilityLabel="Delete last letter"
            accessibilityRole="button"
            className="flex-row items-center justify-center h-12 rounded-2xl bg-surfaceContainerLow"
            style={styles.controlButton}
          >
            <Ionicons
              name="backspace-outline"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>

          <Pressable
            onPress={clearAll}
            accessibilityLabel="Clear all letters"
            accessibilityRole="button"
            className="flex-row items-center justify-center h-12 rounded-2xl bg-surfaceContainerLow"
            style={styles.controlButton}
          >
            <Ionicons
              name="close-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text className="text-sm font-semibold text-textSecondary">
              Clear
            </Text>
          </Pressable>

          <Pressable
            onPress={hint}
            disabled={hints >= 2}
            accessibilityLabel={`Get hint. ${2 - hints} remaining.`}
            accessibilityRole="button"
            accessibilityState={{ disabled: hints >= 2 }}
            className="flex-row items-center justify-center h-12 rounded-2xl bg-highlight-yellow border border-yellow-200"
            style={[styles.controlButton, { opacity: hints >= 2 ? 0.4 : 1 }]}
          >
            <Ionicons name="bulb-outline" size={20} color={HINT_ICON} />
            <Text className="text-sm font-semibold text-yellow-700">Hint</Text>
          </Pressable>
        </View>

        <View className="px-4">
          <Pressable
            onPress={submit}
            disabled={input.length < word.word.length}
            accessibilityLabel="Check answer"
            accessibilityRole="button"
            accessibilityState={{ disabled: input.length < word.word.length }}
            style={
              input.length < word.word.length ? styles.submitDisabled : undefined
            }
            className="h-14 rounded-2xl bg-primary items-center justify-center"
          >
            <Text className="text-base font-bold text-white tracking-wide">
              Check Answer
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 100 },
  progressRow: { gap: 8 },
  clueRow: { gap: 8 },
  controls: { gap: 10 },
  controlButton: { flex: 1, gap: 6 },
  gridWrap: { padding: 4, borderRadius: 16, gap: CELL_GAP },
  submitDisabled: { opacity: 0.4 },
});
