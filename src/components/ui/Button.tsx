import React from "react";
import { Pressable, Text, ActivityIndicator, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { colors } from "@/theme/colors";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: "px-3 py-1.5 rounded-xl", text: "text-sm" },
  md: { container: "px-4 py-2.5 rounded-xl", text: "text-base" },
  lg: { container: "px-6 py-3.5 rounded-xl", text: "text-lg" },
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const sStyle = sizeStyles[size];

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const renderContent = (textColor: string) => (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text
            style={[styles.label, { color: textColor }]}
            className={`${sStyle.text}`}
          >
            {title}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </>
  );

  const pressableProps = {
    onPress: handlePress,
    onPressIn: () => {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
    },
    onPressOut: () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    },
    disabled: isDisabled,
    accessibilityRole: "button" as const,
    accessibilityLabel: title,
    accessibilityState: { disabled: isDisabled },
  };

  if (variant === "primary") {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable {...pressableProps}>
          <LinearGradient
            colors={[colors.primary.DEFAULT, colors.primary.container]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`flex-row items-center justify-center ${sStyle.container} ${
              fullWidth ? "w-full" : ""
            } ${isDisabled ? "opacity-50" : ""}`}
          >
            {renderContent(colors.onPrimary)}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  const variantMap: Record<
    Exclude<ButtonVariant, "primary">,
    { container: string; textColor: string }
  > = {
    secondary: {
      container: "bg-surfaceContainerHigh",
      textColor: colors.primary.DEFAULT,
    },
    outline: {
      container: "bg-transparent border border-outlineVariant/40",
      textColor: colors.primary.DEFAULT,
    },
    ghost: {
      container: "bg-transparent",
      textColor: colors.primary.DEFAULT,
    },
    danger: {
      container: "bg-error",
      textColor: colors.onPrimary,
    },
  };

  const vStyle = variantMap[variant];

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...pressableProps}
        className={`flex-row items-center justify-center ${vStyle.container} ${sStyle.container} ${
          fullWidth ? "w-full" : ""
        } ${isDisabled ? "opacity-50" : "active:opacity-80"}`}
      >
        {renderContent(vStyle.textColor)}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: "Inter_600SemiBold" },
});
