import React from 'react';
import { Pressable, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${
        selected ? 'bg-primary' : 'bg-surface border border-border'
      }`}
    >
      <Text className={`text-sm ${selected ? 'text-white font-semibold' : 'text-textSecondary'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
