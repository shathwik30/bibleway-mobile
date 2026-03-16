import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  count: number;
  size?: 'sm' | 'md';
}

export default function Badge({ count, size = 'sm' }: BadgeProps) {
  if (count <= 0) return null;

  const display = count > 99 ? '99+' : String(count);
  const sizeClass = size === 'sm' ? 'min-w-[18px] h-[18px] px-1' : 'min-w-[22px] h-[22px] px-1.5';
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <View className={`bg-error rounded-full items-center justify-center ${sizeClass}`}>
      <Text className={`text-white font-bold ${textSize}`}>{display}</Text>
    </View>
  );
}
