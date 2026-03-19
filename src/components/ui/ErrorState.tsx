import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
      <Text className="text-lg font-semibold text-textPrimary mt-4 text-center">{message}</Text>
      {onRetry && (
        <View className="mt-4">
          <Button title="Retry" onPress={onRetry} variant="outline" size="sm" />
        </View>
      )}
    </View>
  );
}
