import React from 'react';
import { ActivityIndicator, View } from 'react-native';

interface SpinnerProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export default function Spinner({ size = 'large', fullScreen = false }: SpinnerProps) {
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={size} color="#4A6FA5" />
      </View>
    );
  }

  return <ActivityIndicator size={size} color="#4A6FA5" />;
}
