import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightHaptic } from '@/lib/haptics';

interface IconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function IconButton({ name, size = 24, color = '#1A1A2E', onPress, disabled = false }: IconButtonProps) {
  const handlePress = () => {
    lightHaptic();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={name}
      className={`p-2 rounded-full active:bg-surface ${disabled ? 'opacity-50' : ''}`}
    >
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}
