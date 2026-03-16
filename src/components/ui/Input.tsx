import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-textPrimary mb-1.5">{label}</Text>
      )}
      <View
        className={`flex-row items-center border rounded-lg px-3 py-2.5 bg-white ${
          error ? 'border-error' : isFocused ? 'border-primary' : 'border-border'
        }`}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          {...props}
          secureTextEntry={isSecure}
          className="flex-1 text-base text-textPrimary"
          placeholderTextColor="#9CA3AF"
          accessibilityLabel={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setIsSecure(!isSecure)} className="ml-2">
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#6B7280"
            />
          </Pressable>
        )}
        {rightIcon && !secureTextEntry && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && <Text className="text-xs text-error mt-1">{error}</Text>}
    </View>
  );
}
