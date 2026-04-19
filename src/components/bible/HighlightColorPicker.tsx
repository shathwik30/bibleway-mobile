import React, { useMemo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import type { HighlightColor } from "@/types/enums";

const COLORS: { key: HighlightColor; value: string }[] = [
  { key: "yellow", value: colors.highlight.yellow },
  { key: "green", value: colors.highlight.green },
  { key: "blue", value: colors.highlight.blue },
  { key: "pink", value: colors.highlight.pink },
];

interface HighlightColorPickerProps {
  selected: HighlightColor;
  onSelect: (color: HighlightColor) => void;
}

export default function HighlightColorPicker({
  selected,
  onSelect,
}: HighlightColorPickerProps) {
  /*
   * Pre-compute one style-object per swatch once, so the `style` prop
   * on each Pressable has stable reference across renders. The colors
   * array is module-scoped so the useMemo below only runs once.
   */
  const swatchStyles = useMemo(
    () =>
      Object.fromEntries(
        COLORS.map((c) => [c.key, { backgroundColor: c.value }]),
      ) as Record<HighlightColor, { backgroundColor: string }>,
    [],
  );

  return (
    <View className="flex-row items-center">
      {COLORS.map((c) => (
        <Pressable
          key={c.key}
          onPress={() => onSelect(c.key)}
          accessibilityLabel={`${c.key} highlight color`}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === c.key }}
          style={[styles.swatch, swatchStyles[c.key]]}
          className="items-center justify-center"
        >
          {selected === c.key && (
            <Ionicons name="checkmark" size={16} color={colors.textPrimary} />
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 6,
  },
});
