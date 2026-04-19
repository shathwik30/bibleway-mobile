import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { REACTIONS } from "@/constants/reactions";
import { colors } from "@/theme/colors";
import type { EmojiType } from "@/types/enums";

interface ReactionPickerProps {
  onSelect: (type: EmojiType) => void;
  selectedType?: EmojiType | null;
}

export default function ReactionPicker({
  onSelect,
  selectedType,
}: ReactionPickerProps) {
  return (
    <View
      className="flex-row bg-surfaceContainerLowest rounded-full px-2 py-1.5"
      style={styles.shadow}
    >
      {REACTIONS.map((r) => (
        <Pressable
          key={r.type}
          onPress={() => onSelect(r.type)}
          accessibilityLabel={`React with ${r.type}`}
          accessibilityRole="button"
          accessibilityState={{ selected: selectedType === r.type }}
          className={`px-2.5 py-1 rounded-full mx-0.5 ${
            selectedType === r.type ? "bg-primaryLight/30" : ""
          }`}
        >
          <Text className="text-2xl">{r.emoji}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.04,
    shadowRadius: 40,
    elevation: 4,
  },
});
