import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

export default function BoostedBadge() {
  return (
    <View className="flex-row items-center bg-tertiary-fixed/20 px-2 py-0.5 rounded-full">
      <Ionicons name="flash" size={12} color={colors.tertiary.fixedDim} />
      <Text className="text-[10px] font-semibold text-secondary ml-0.5">
        Boosted
      </Text>
    </View>
  );
}
