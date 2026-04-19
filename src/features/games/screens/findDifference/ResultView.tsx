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

interface ResultViewProps {
  differenceCount: number;
  isLastLevel: boolean;
  onNextLevel: () => void;
  onPlayAgain: () => void;
  onBackToLevels: () => void;
}

export default function ResultView({
  differenceCount,
  isLastLevel,
  onNextLevel,
  onPlayAgain,
  onBackToLevels,
}: ResultViewProps) {
  const { width: SW } = useWindowDimensions();
  const buttonWidth = SW - 80;

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Find the Difference" showBack={false} />
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View entering={ZoomIn.springify()} className="items-center">
          <View className="w-20 h-20 rounded-full bg-highlight-green items-center justify-center mb-4">
            <Ionicons name="eye" size={40} color={colors.success} />
          </View>
          <Text className="text-xl font-bold text-textPrimary mb-1">
            Well Done!
          </Text>
          <Text className="text-sm text-textSecondary mb-6">
            You found all {differenceCount} differences
          </Text>

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
  button: { gap: 8 },
});
