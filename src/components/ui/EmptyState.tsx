import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = 'albums-outline', title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <Ionicons name={icon} size={64} color="#D1D5DB" />
      <Text className="text-lg font-semibold text-textPrimary dark:text-gray-100 mt-4 text-center">{title}</Text>
      {message && (
        <Text className="text-sm text-textSecondary dark:text-gray-400 mt-2 text-center">{message}</Text>
      )}
      {actionLabel && onAction && (
        <View className="mt-4">
          <Button title={actionLabel} onPress={onAction} variant="primary" size="md" />
        </View>
      )}
    </View>
  );
}
