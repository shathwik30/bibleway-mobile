import React, { useState, useCallback } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({ onSearch, placeholder = 'Search...', debounceMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState('');
  const timeoutRef = React.useRef<NodeJS.Timeout>(undefined);

  const handleChange = useCallback(
    (text: string) => {
      setValue(text);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => onSearch(text), debounceMs);
    },
    [onSearch, debounceMs]
  );

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <View className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
      <Ionicons name="search-outline" size={20} color="#6B7280" />
      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className="flex-1 ml-2 text-base text-textPrimary"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear}>
          <Ionicons name="close-circle" size={20} color="#9CA3AF" />
        </Pressable>
      )}
    </View>
  );
}
