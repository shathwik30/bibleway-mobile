import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { FTD_LEVELS } from "@/features/games/data/findDifferenceLevels";
import { colors } from "@/theme/colors";

const COMPLETED_BG = colors.feedback.successBg;

interface LevelSelectProps {
  unlockedLevel: number;
  completedLevels: Set<number>;
  onSelectLevel: (id: number) => void;
}

export default function LevelSelect({
  unlockedLevel,
  completedLevels,
  onSelectLevel,
}: LevelSelectProps) {
  return (
    <SafeAreaScreen>
      <ScreenHeader title="Find the Difference" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm text-textSecondary text-center mb-4">
          Compare two pictures and pick the differences from the options
        </Text>

        <View style={styles.grid}>
          {FTD_LEVELS.map((level, i) => {
            const locked = level.id > unlockedLevel;
            const completed = completedLevels.has(level.id);
            const borderColor = completed
              ? colors.success
              : locked
                ? colors.surfaceContainerHighest
                : colors.primary.DEFAULT;
            const backgroundColor = completed ? COMPLETED_BG : colors.surface;
            const labelColor = completed
              ? colors.success
              : locked
                ? colors.textTertiary
                : colors.primary.DEFAULT;

            return (
              <Animated.View
                key={level.id}
                entering={FadeInDown.delay(i * 30).springify()}
                style={styles.tile}
              >
                <Pressable
                  onPress={() => !locked && onSelectLevel(level.id)}
                  disabled={locked}
                  accessibilityLabel={
                    locked
                      ? `Level ${level.id} ${level.title}. Locked.`
                      : `Level ${level.id} ${level.title}${completed ? ", completed" : ""}`
                  }
                  accessibilityRole="button"
                  accessibilityState={{ disabled: locked }}
                  style={[
                    styles.pressable,
                    {
                      opacity: locked ? 0.4 : 1,
                      borderColor,
                      backgroundColor,
                    },
                  ]}
                >
                  {completed ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={28}
                      color={colors.success}
                    />
                  ) : locked ? (
                    <Ionicons
                      name="lock-closed"
                      size={24}
                      color={colors.textTertiary}
                    />
                  ) : (
                    <Text className="text-xl font-bold text-primary">
                      {level.id}
                    </Text>
                  )}
                  <Text
                    className="text-xs font-semibold mt-1"
                    style={{ color: labelColor }}
                  >
                    {level.title}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: { width: "31%" },
  pressable: {
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
