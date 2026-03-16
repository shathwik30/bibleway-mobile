import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { HighlightColor } from '@/types/enums';

const COLORS: { key: HighlightColor; value: string }[] = [
  { key: 'yellow', value: '#FEF3C7' },
  { key: 'green', value: '#D1FAE5' },
  { key: 'blue', value: '#DBEAFE' },
  { key: 'pink', value: '#FCE7F3' },
];

interface HighlightColorPickerProps {
  selected: HighlightColor;
  onSelect: (color: HighlightColor) => void;
}

export default function HighlightColorPicker({ selected, onSelect }: HighlightColorPickerProps) {
  return (
    <View className="flex-row items-center">
      {COLORS.map((c) => (
        <Pressable
          key={c.key}
          onPress={() => onSelect(c.key)}
          style={{ backgroundColor: c.value }}
          className="w-8 h-8 rounded-full mx-1.5 items-center justify-center border border-border"
        >
          {selected === c.key && <Ionicons name="checkmark" size={16} color="#1A1A2E" />}
        </Pressable>
      ))}
    </View>
  );
}
