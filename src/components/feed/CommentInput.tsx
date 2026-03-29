import React, { useState } from 'react';
import { View, TextInput, Pressable, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import StickerPicker from './StickerPicker';

interface CommentInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export default function CommentInput({ onSubmit, placeholder = 'Write a comment...', loading = false }: CommentInputProps) {
  const [text, setText] = useState('');
  const [showStickers, setShowStickers] = useState(false);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setText('');
    setShowStickers(false);
  };

  const handleStickerSelect = (stickerId: number) => {
    if (loading) return;
    onSubmit(`[sticker:${stickerId}]`);
    setText('');
    setShowStickers(false);
  };

  const toggleStickers = () => {
    if (!showStickers) Keyboard.dismiss();
    setShowStickers(!showStickers);
  };

  return (
    <View>
      <View className="flex-row items-end px-4 py-2 border-t border-border bg-white">
        <Pressable onPress={toggleStickers} className="p-2 mr-1">
          <Ionicons
            name={showStickers ? 'close-circle-outline' : 'happy-outline'}
            size={24}
            color={showStickers ? colors.primary.DEFAULT : colors.textSecondary}
          />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={(v) => { setText(v); if (showStickers) setShowStickers(false); }}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={1000}
          className="flex-1 text-base text-textPrimary bg-surface rounded-2xl px-4 py-2 max-h-24"
          onFocus={() => setShowStickers(false)}
        />
        <Pressable
          onPress={handleSubmit}
          disabled={!text.trim() || loading}
          className={`ml-2 p-2 ${text.trim() ? '' : 'opacity-40'}`}
        >
          <Ionicons name="send" size={24} color={colors.primary.DEFAULT} />
        </Pressable>
      </View>
      {showStickers && <StickerPicker onSelect={handleStickerSelect} />}
    </View>
  );
}
