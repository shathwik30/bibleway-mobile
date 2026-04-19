import React from "react";
import { Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import type { WordData } from "@/constants/crosswordLevels";

const ACTIVE_BG = colors.feedback.infoBg;
const SOLVED_BG = colors.feedback.successBg;

interface WordSelectorProps {
  words: WordData[];
  currentIdx: number;
  solved: Set<number>;
  onSelect: (idx: number) => void;
}

export default function WordSelector({
  words,
  currentIdx,
  solved,
  onSelect,
}: WordSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {words.map((w, i) => {
        const isSolved = solved.has(i);
        const isActive = i === currentIdx;
        const borderColor = isSolved
          ? colors.success
          : isActive
            ? colors.primary.DEFAULT
            : colors.surfaceContainerHighest;
        const backgroundColor = isSolved
          ? SOLVED_BG
          : isActive
            ? ACTIVE_BG
            : colors.surfaceContainerLowest;
        const textColor = isSolved
          ? colors.success
          : isActive
            ? colors.primary.DEFAULT
            : colors.textSecondary;

        return (
          <Pressable
            key={i}
            onPress={() => !isSolved && onSelect(i)}
            disabled={isSolved}
            accessibilityLabel={`${w.word.length}-letter ${w.direction} word${isSolved ? ", solved" : isActive ? ", active" : ""}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive, disabled: isSolved }}
            style={[styles.chip, { borderColor, backgroundColor }]}
          >
            {isSolved && (
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            )}
            <Text style={[styles.chipText, { color: textColor }]}>
              {w.word.length} letters · {w.direction}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, gap: 6, paddingBottom: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    gap: 4,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
