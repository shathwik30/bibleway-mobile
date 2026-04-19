import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}

export default function AnalyticsCard({
  title,
  value,
  icon,
  color = colors.primary.DEFAULT,
}: AnalyticsCardProps) {
  return (
    <View className="bg-surfaceContainerLowest rounded-xl p-4 flex-1 mx-1">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon} size={20} color={color} />
        <Text className="text-xs text-textSecondary ml-1.5">{title}</Text>
      </View>
      <Text className="text-2xl text-textPrimary" style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  value: { fontFamily: "Inter_700Bold" },
});
