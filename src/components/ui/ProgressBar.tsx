import React, { useMemo } from "react";
import { View } from "react-native";
import { colors } from "@/theme/colors";

interface ProgressBarProps {
  progress: number;
  color?: string;
}

export default function ProgressBar({
  progress,
  color = colors.primary.DEFAULT,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const fillStyle = useMemo(
    () =>
      ({
        width: `${clampedProgress * 100}%` as const,
        backgroundColor: color,
      }) as const,
    [clampedProgress, color],
  );

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 1, now: clampedProgress }}
      className="h-2 bg-surface rounded-full overflow-hidden"
    >
      <View style={fillStyle} className="h-full rounded-full" />
    </View>
  );
}
