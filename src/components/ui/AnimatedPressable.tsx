import React, { useCallback } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface AnimatedPressableProps {
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  haptic?: boolean;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  scaleValue?: number;
  style?: ViewStyle;
  className?: string;
  children: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'tab' | 'none';
}

export default function AnimatedPressable({
  onPress,
  onLongPress,
  disabled = false,
  haptic = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  scaleValue = 0.97,
  style,
  className,
  children,
  accessibilityLabel,
  accessibilityRole = 'button',
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(scaleValue, { damping: 15, stiffness: 200 });
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, []);

  const handlePress = useCallback(() => {
    if (haptic) {
      Haptics.impactAsync(hapticStyle);
    }
    onPress?.();
  }, [haptic, hapticStyle, onPress]);

  const handleLongPress = useCallback(() => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onLongPress?.();
  }, [haptic, onLongPress]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onLongPress={onLongPress ? handleLongPress : undefined}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={style}
        className={className}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
