import React, { useState, useCallback } from "react";
import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
  debounceMs = 300,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const handleChange = useCallback(
    (text: string) => {
      setValue(text);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => onSearch(text), debounceMs);
    },
    [onSearch, debounceMs],
  );

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <View className="flex-row items-center bg-surfaceContainerHigh rounded-xl px-3 py-2">
      <Ionicons name="search-outline" size={20} color={colors.textTertiary} />
      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        className="flex-1 ml-2 text-base text-textPrimary"
        returnKeyType="search"
        style={{ fontFamily: "Inter_400Regular" }}
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear}>
          <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
        </Pressable>
      )}
    </View>
  );
}
