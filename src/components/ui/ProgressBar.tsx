import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
}

export default function ProgressBar({ progress, color = '#4A6FA5' }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View className="h-2 bg-surface rounded-full overflow-hidden">
      <View
        style={{ width: `${clampedProgress * 100}%`, backgroundColor: color }}
        className="h-full rounded-full"
      />
    </View>
  );
}
