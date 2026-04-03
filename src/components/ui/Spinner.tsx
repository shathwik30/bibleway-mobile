import React from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/theme/colors";

interface SpinnerProps {
  size?: "small" | "large";
  fullScreen?: boolean;
}

export default function Spinner({
  size = "large",
  fullScreen = false,
}: SpinnerProps) {
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size={size} color={colors.primary.DEFAULT} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={colors.primary.DEFAULT} />;
}
