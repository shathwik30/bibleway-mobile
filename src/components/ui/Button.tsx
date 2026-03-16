import React from 'react';
import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

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

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-secondary',
    text: 'text-white',
  },
  outline: {
    container: 'bg-transparent border border-primary',
    text: 'text-primary',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-primary',
  },
  danger: {
    container: 'bg-error',
    text: 'text-white',
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'px-3 py-1.5 rounded-md', text: 'text-sm' },
  md: { container: 'px-4 py-2.5 rounded-lg', text: 'text-base' },
  lg: { container: 'px-6 py-3.5 rounded-xl', text: 'text-lg' },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 200 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 200 }); }}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: isDisabled }}
        className={`flex-row items-center justify-center ${vStyle.container} ${sStyle.container} ${
          fullWidth ? 'w-full' : ''
        } ${isDisabled ? 'opacity-50' : 'active:opacity-80'}`}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variant === 'outline' || variant === 'ghost' ? '#4A6FA5' : '#FFFFFF'} />
        ) : (
          <>
            {leftIcon && <View className="mr-2">{leftIcon}</View>}
            <Text className={`font-semibold ${vStyle.text} ${sStyle.text}`}>{title}</Text>
            {rightIcon && <View className="ml-2">{rightIcon}</View>}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
