import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { colors } from "@/theme/colors";
import type { LevelData } from "@/constants/crosswordLevels";

interface LevelCompleteProps {
  level: LevelData;
  score: number;
  isLastLevel: boolean;
  onNext: () => void;
  onReplay: () => void;
  onLevels: () => void;
  screenWidth: number;
}

export default function LevelComplete({
  level,
  score,
  isLastLevel,
  onNext,
  onReplay,
  onLevels,
  screenWidth,
}: LevelCompleteProps) {
  const stars =
    score >= level.words.length * 80
      ? 3
      : score >= level.words.length * 50
        ? 2
        : 1;
  const buttonWidth = screenWidth - 80;

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Bible Crossword" showBack={false} />
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View entering={ZoomIn.springify()} className="items-center">
          <View className="w-20 h-20 rounded-full bg-highlight-green items-center justify-center mb-4">
            <Ionicons name="trophy" size={40} color={colors.success} />
          </View>

          <Text className="text-xl font-bold text-textPrimary mb-1">
            {level.theme}
          </Text>
          <Text className="text-sm text-textSecondary mb-5">
            Level Complete!
          </Text>

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

          <View
            className="flex-row items-center bg-surfaceContainerLow rounded-2xl mb-8"
            style={{ width: buttonWidth }}
          >
            <View className="flex-1 items-center py-4">
              <Ionicons name="trophy-outline" size={20} color={colors.warning} />
              <Text className="text-xl font-bold text-textPrimary mt-1">
                {score}
              </Text>
              <Text className="text-xs text-textSecondary">Points</Text>
            </View>
            <View style={styles.divider} className="bg-surfaceContainerHigh" />
            <View className="flex-1 items-center py-4">
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={colors.success}
              />
              <Text className="text-xl font-bold text-textPrimary mt-1">
                {level.words.length}/{level.words.length}
              </Text>
              <Text className="text-xs text-textSecondary">Solved</Text>
            </View>
          </View>

          {!isLastLevel && (
            <Pressable
              onPress={onNext}
              accessibilityLabel="Next level"
              accessibilityRole="button"
              className="bg-primary rounded-2xl py-4 mb-3 flex-row items-center justify-center"
              style={[styles.actionButton, { width: buttonWidth }]}
            >
              <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
              <Text className="text-white font-bold text-base">Next Level</Text>
            </Pressable>
          )}

          <Pressable
            onPress={onReplay}
            accessibilityLabel="Replay this level"
            accessibilityRole="button"
            className="rounded-2xl py-4 mb-3 bg-surfaceContainerLow flex-row items-center justify-center"
            style={[styles.actionButton, { width: buttonWidth }]}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={colors.textSecondary}
            />
            <Text className="text-textSecondary font-semibold">Play Again</Text>
          </Pressable>

          <Pressable
            onPress={onLevels}
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
  divider: { width: 1, height: 40 },
  actionButton: { gap: 8 },
});
