import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { QUIZ_LEVELS } from "@/constants/quizLevels";
import { colors } from "@/theme/colors";

const COMPLETED_BG = colors.feedback.successBg;
const ACTIVE_ACTION_BG = colors.feedback.infoBg;

interface LevelSelectProps {
  unlockedLevel: number;
  completedLevels: Set<number>;
  highScores: Record<number, number>;
  onSelectLevel: (id: number) => void;
}

export default function LevelSelect({
  unlockedLevel,
  completedLevels,
  highScores,
  onSelectLevel,
}: LevelSelectProps) {
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

          const badgeBorder = completed
            ? colors.success
            : locked
              ? colors.surfaceContainerHighest
              : colors.primary.DEFAULT;
          const badgeBg = completed ? COMPLETED_BG : colors.surfaceContainerLowest;
          const actionBg = completed ? COMPLETED_BG : ACTIVE_ACTION_BG;
          const actionColor = completed ? colors.success : colors.primary.DEFAULT;

          return (
            <Animated.View
              key={level.id}
              entering={FadeInDown.delay(i * 50).springify()}
            >
              <Pressable
                onPress={() => !locked && onSelectLevel(level.id)}
                disabled={locked}
                accessibilityLabel={
                  locked
                    ? `Level ${level.id} ${level.theme}. Locked.`
                    : `Level ${level.id} ${level.theme}. ${level.questions.length} questions.${best !== undefined ? ` Best: ${best}.` : ""}`
                }
                accessibilityRole="button"
                accessibilityState={{ disabled: locked }}
                style={[styles.row, locked && styles.locked]}
                className="flex-row items-center bg-surfaceContainerLow rounded-2xl p-4"
              >
                <View
                  style={[
                    styles.badge,
                    { borderColor: badgeBorder, backgroundColor: badgeBg },
                  ]}
                  className="items-center justify-center mr-3"
                >
                  {completed ? (
                    <Ionicons name="checkmark" size={22} color={colors.success} />
                  ) : locked ? (
                    <Ionicons
                      name="lock-closed"
                      size={16}
                      color={colors.textTertiary}
                    />
                  ) : (
                    <Text className="text-base font-bold text-primary">
                      {level.id}
                    </Text>
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-base font-bold text-textPrimary">
                    {level.theme}
                  </Text>
                  <Text className="text-xs text-textSecondary mt-0.5">
                    {level.title} · {level.questions.length} questions
                  </Text>
                </View>

                {best !== undefined && (
                  <View className="flex-row items-center mr-2">
                    <Ionicons name="star" size={12} color={colors.warning} />
                    <Text className="text-xs font-bold text-textSecondary ml-1">
                      {best}/{level.questions.length}
                    </Text>
                  </View>
                )}

                {!locked && (
                  <View
                    style={[styles.action, { backgroundColor: actionBg }]}
                    className="items-center justify-center"
                  >
                    <Ionicons
                      name={completed ? "refresh" : "play"}
                      size={16}
                      color={actionColor}
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

const styles = StyleSheet.create({
  row: { marginBottom: 10 },
  locked: { opacity: 0.4 },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  action: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
