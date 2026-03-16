import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import Button from '../ui/Button';

interface NoteEditorProps {
  initialText?: string;
  onSave: (text: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function NoteEditor({ initialText = '', onSave, onCancel, loading = false }: NoteEditorProps) {
  const [text, setText] = useState(initialText);

  return (
    <View className="p-4">
      <Text className="text-base font-semibold text-textPrimary mb-2">
        {initialText ? 'Edit Note' : 'Add Note'}
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Write your note..."
        placeholderTextColor="#9CA3AF"
        multiline
        className="text-base text-textPrimary bg-surface rounded-xl p-3 min-h-[120px] border border-border"
        textAlignVertical="top"
      />
      <View className="flex-row justify-end mt-3 gap-2">
        <Button title="Cancel" onPress={onCancel} variant="ghost" size="sm" />
        <Button
          title="Save"
          onPress={() => onSave(text)}
          disabled={!text.trim()}
          loading={loading}
          size="sm"
        />
      </View>
    </View>
  );
}
