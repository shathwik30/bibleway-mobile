import React from "react";
import { View, Pressable } from "react-native";
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
  return (
    <View className="flex-row items-center">
      {COLORS.map((c) => (
        <Pressable
          key={c.key}
          onPress={() => onSelect(c.key)}
          accessibilityLabel={`${c.key} highlight color`}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === c.key }}
          style={{ backgroundColor: c.value }}
          className="w-8 h-8 rounded-full mx-1.5 items-center justify-center"
        >
          {selected === c.key && (
            <Ionicons name="checkmark" size={16} color={colors.textPrimary} />
          )}
        </Pressable>
      ))}
    </View>
  );
}
