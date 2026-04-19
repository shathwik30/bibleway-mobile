import React, { useCallback } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { lightHaptic } from "@/lib/haptics";
import { colors } from "@/theme/colors";

interface IconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export default function IconButton({
  name,
  size = 24,
  color = colors.textPrimary,
  onPress,
  disabled = false,
  accessibilityLabel,
}: IconButtonProps) {
  const handlePress = useCallback(() => {
    lightHaptic();
    onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`p-2 rounded-full active:bg-surface ${disabled ? "opacity-50" : ""}`}
    >
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}
