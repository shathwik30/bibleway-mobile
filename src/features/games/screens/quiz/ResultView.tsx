import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { colors } from "@/theme/colors";
import type { QuizLevel } from "@/features/games/data/quizLevels";

interface ResultViewProps {
  level: QuizLevel;
  correctCount: number;
  isLastLevel: boolean;
  onNextLevel: () => void;
  onPlayAgain: () => void;
  onBackToLevels: () => void;
}

export default function ResultView({
  level,
  correctCount,
  isLastLevel,
  onNextLevel,
  onPlayAgain,
  onBackToLevels,
}: ResultViewProps) {
  const { width: SW } = useWindowDimensions();
  const stars =
    correctCount >= level.questions.length ? 3 : correctCount >= 3 ? 2 : 1;
  const buttonWidth = SW - 80;

  return (
    <SafeAreaScreen>
      <ScreenHeader title={level.theme} showBack={false} />
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View entering={ZoomIn.springify()} className="items-center">
          <View className="w-20 h-20 rounded-full bg-highlight-green items-center justify-center mb-4">
            <Ionicons name="ribbon" size={40} color={colors.success} />
          </View>

          <Text className="text-xl font-bold text-textPrimary mb-1">
            Quiz Complete!
          </Text>
          <Text className="text-sm text-textSecondary mb-5">{level.theme}</Text>

          <View className="flex-row items-center mb-5">
            {[1, 2, 3].map((n) => (
              <Ionicons
                key={n}
                name={n <= stars ? "star" : "star-outline"}
                size={34}
                color={colors.warning}
                style={styles.star}
              />
            ))}
          </View>

          <View className="bg-surfaceContainerLow rounded-2xl px-10 py-5 items-center mb-8">
            <Text className="text-4xl font-bold text-primary">
              {correctCount}/{level.questions.length}
            </Text>
            <Text className="text-xs text-textSecondary font-semibold mt-1">
              Correct Answers
            </Text>
          </View>

          {!isLastLevel && (
            <Pressable
              onPress={onNextLevel}
              accessibilityLabel="Next level"
              accessibilityRole="button"
              className="bg-primary rounded-2xl py-4 mb-3 flex-row items-center justify-center"
              style={[styles.button, { width: buttonWidth }]}
            >
              <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
              <Text className="text-white font-bold text-base">Next Level</Text>
            </Pressable>
          )}

          <Pressable
            onPress={onPlayAgain}
            accessibilityLabel="Play this level again"
            accessibilityRole="button"
            className="rounded-2xl py-4 mb-3 bg-surfaceContainerLow flex-row items-center justify-center"
            style={[styles.button, { width: buttonWidth }]}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={colors.textSecondary}
            />
            <Text className="text-textSecondary font-semibold">Play Again</Text>
          </Pressable>

          <Pressable
            onPress={onBackToLevels}
            accessibilityLabel="Back to level list"
            accessibilityRole="button"
            className="py-3"
          >
            <Text className="text-primary font-semibold">All Levels</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  star: { marginHorizontal: 4 },
  button: { gap: 8 },
});
