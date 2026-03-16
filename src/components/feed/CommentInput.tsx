import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CommentInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export default function CommentInput({ onSubmit, placeholder = 'Write a comment...', loading = false }: CommentInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setText('');
  };

  return (
    <View className="flex-row items-end px-4 py-2 border-t border-border bg-white">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline
        maxLength={1000}
        className="flex-1 text-base text-textPrimary bg-surface rounded-2xl px-4 py-2 max-h-24"
      />
      <Pressable
        onPress={handleSubmit}
        disabled={!text.trim() || loading}
        className={`ml-2 p-2 ${text.trim() ? '' : 'opacity-40'}`}
      >
        <Ionicons name="send" size={24} color="#4A6FA5" />
      </Pressable>
    </View>
  );
}
