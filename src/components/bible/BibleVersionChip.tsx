import React from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BibleVersionChipProps {
  version: string;
  onPress: () => void;
}

export default function BibleVersionChip({
  version,
  onPress,
}: BibleVersionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-surfaceContainerHigh rounded-full px-3 py-1.5"
    >
      <Text className="text-sm font-semibold text-primary mr-1">{version}</Text>
      <Ionicons name="chevron-down" size={14} color="#59021a" />
    </Pressable>
  );
}
