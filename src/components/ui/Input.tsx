import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface InputProps extends Omit<TextInputProps, "className"> {
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
        <Text className="text-sm text-textPrimary mb-1.5" style={styles.label}>
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center rounded-xl px-3 py-2.5 ${
          error
            ? "bg-error-container"
            : isFocused
              ? "bg-surfaceContainerLowest border border-tertiary-fixedDim"
              : "bg-surfaceContainerHigh"
        }`}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          {...props}
          secureTextEntry={isSecure}
          className="flex-1 text-base text-textPrimary"
          placeholderTextColor={colors.textTertiary}
          accessibilityLabel={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.input}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setIsSecure(!isSecure)} className="ml-2">
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
        {rightIcon && !secureTextEntry && (
          <View className="ml-2">{rightIcon}</View>
        )}
      </View>
      {error && <Text className="text-xs text-error mt-1">{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: "Inter_500Medium" },
  input: { fontFamily: "Inter_400Regular" },
});
