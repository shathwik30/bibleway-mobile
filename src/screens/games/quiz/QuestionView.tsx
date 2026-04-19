import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { colors } from "@/theme/colors";
import type { QuizLevel } from "@/constants/quizLevels";

const OPTION_CORRECT_BG = colors.feedback.successBg;
const OPTION_WRONG_BG = colors.feedback.errorBg;
const HINT_ICON_COLOR = colors.feedback.hintAccent;

interface QuestionViewProps {
  level: QuizLevel;
  levelId: number;
  questionIdx: number;
  selected: number | null;
  answered: boolean;
  correctCount: number;
  showHint: boolean;
  onSelectAnswer: (optIdx: number) => void;
  onNext: () => void;
  onShowHint: () => void;
}

export default function QuestionView({
  level,
  levelId,
  questionIdx,
  selected,
  answered,
  showHint,
  onSelectAnswer,
  onNext,
  onShowHint,
}: QuestionViewProps) {
  // questionIdx is always within bounds — parent advances via nextQuestion
  // which ends the quiz when we hit level.questions.length.
  const question = level.questions[questionIdx]!;
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleSelect = (optIdx: number): void => {
    if (answered) return;
    if (optIdx !== question.correctIndex) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
    onSelectAnswer(optIdx);
  };

  const getOptionClassName = (optIdx: number): string => {
    if (!answered) {
      return selected === optIdx
        ? "border-primary bg-primary/5"
        : "border-surfaceContainerHigh bg-surfaceContainerLowest";
    }
    if (optIdx === question.correctIndex)
      return "border-success bg-highlight-green";
    if (optIdx === selected) return "border-error bg-red-50";
    return "border-surfaceContainerHigh bg-surfaceContainerLowest";
  };

  const getOptionIcon = (optIdx: number): React.ReactElement | null => {
    if (!answered) return null;
    if (optIdx === question.correctIndex)
      return <Ionicons name="checkmark-circle" size={22} color={colors.success} />;
    if (optIdx === selected)
      return <Ionicons name="close-circle" size={22} color={colors.error} />;
    return null;
  };

  const getBadgeStyle = (optIdx: number) => {
    const isCorrect = answered && optIdx === question.correctIndex;
    const isWrongSelected = answered && optIdx === selected;
    return {
      borderColor: isCorrect
        ? colors.success
        : isWrongSelected
          ? colors.error
          : colors.surfaceContainerHighest,
      backgroundColor: isCorrect
        ? OPTION_CORRECT_BG
        : isWrongSelected
          ? OPTION_WRONG_BG
          : colors.surfaceContainerLowest,
    };
  };

  const getBadgeTextColor = (optIdx: number): string => {
    if (answered && optIdx === question.correctIndex) return colors.success;
    if (answered && optIdx === selected) return colors.error;
    return colors.textSecondary;
  };

  const progressWidth = `${((questionIdx + (answered ? 1 : 0)) / level.questions.length) * 100}%` as const;

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
        <View className="px-4 py-3">
          <View className="h-1.5 bg-surfaceContainerHigh rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: progressWidth }}
            />
          </View>
        </View>

        <Animated.View
          key={`q-${levelId}-${questionIdx}`}
          entering={FadeInDown.duration(300).springify()}
          className="px-5 mb-5"
        >
          <Text className="text-lg font-bold text-textPrimary leading-7">
            {question.question}
          </Text>
        </Animated.View>

        <Animated.View style={shakeStyle} className="px-4">
          {question.options.map((opt, i) => (
            <Animated.View
              key={`${levelId}-${questionIdx}-${i}`}
              entering={FadeInDown.delay(i * 60).springify()}
            >
              <Pressable
                onPress={() => handleSelect(i)}
                disabled={answered}
                accessibilityLabel={`Option ${String.fromCharCode(65 + i)}: ${opt}`}
                accessibilityRole="button"
                accessibilityState={{
                  disabled: answered,
                  selected: selected === i,
                }}
                className={`flex-row items-center p-4 rounded-2xl border-2 mb-3 ${getOptionClassName(i)}`}
              >
                <View
                  style={[styles.badge, getBadgeStyle(i)]}
                  className="items-center justify-center mr-3"
                >
                  <Text
                    className="text-xs font-bold"
                    style={{ color: getBadgeTextColor(i) }}
                  >
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text className="flex-1 text-sm text-textPrimary leading-5">
                  {opt}
                </Text>
                {getOptionIcon(i)}
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        {!answered && !showHint && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onShowHint();
            }}
            accessibilityLabel="Show hint for this question"
            accessibilityRole="button"
            className="mx-4 mt-2 flex-row items-center justify-center py-3 rounded-2xl bg-highlight-yellow border border-yellow-200"
            style={styles.hintButton}
          >
            <Ionicons name="bulb-outline" size={18} color={HINT_ICON_COLOR} />
            <Text className="text-sm font-semibold text-yellow-700">
              Show Hint
            </Text>
          </Pressable>
        )}

        {showHint && !answered && (
          <Animated.View
            entering={FadeIn.duration(200)}
            className="mx-4 mt-2 bg-highlight-yellow/50 rounded-2xl p-4"
          >
            <View className="flex-row items-center mb-1" style={styles.hintLabel}>
              <Ionicons name="bulb" size={16} color={HINT_ICON_COLOR} />
              <Text className="text-xs font-bold text-yellow-700">HINT</Text>
            </View>
            <Text className="text-sm text-yellow-800">{question.hint}</Text>
          </Animated.View>
        )}

        {answered && (
          <Animated.View entering={FadeIn.delay(300)} className="px-4 mt-5">
            <Pressable
              onPress={onNext}
              accessibilityLabel={
                questionIdx + 1 < level.questions.length
                  ? "Next question"
                  : "See results"
              }
              accessibilityRole="button"
              className="bg-primary rounded-2xl py-4 items-center"
            >
              <Text className="text-white font-bold text-base">
                {questionIdx + 1 < level.questions.length
                  ? "Next Question"
                  : "See Results"}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  hintButton: { gap: 6 },
  hintLabel: { gap: 6 },
});
