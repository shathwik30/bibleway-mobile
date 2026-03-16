import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { REACTIONS } from '@/constants/reactions';
import type { EmojiType } from '@/types/enums';

interface ReactionPickerProps {
  onSelect: (type: EmojiType) => void;
  selectedType?: EmojiType | null;
}

export default function ReactionPicker({ onSelect, selectedType }: ReactionPickerProps) {
  return (
    <View className="flex-row bg-white rounded-full shadow-lg px-2 py-1.5 border border-border">
      {REACTIONS.map((r) => (
        <Pressable
          key={r.type}
          onPress={() => onSelect(r.type)}
          className={`px-2.5 py-1 rounded-full mx-0.5 ${
            selectedType === r.type ? 'bg-primaryLight/30' : ''
          }`}
        >
          <Text className="text-2xl">{r.emoji}</Text>
        </Pressable>
      ))}
    </View>
  );
}
