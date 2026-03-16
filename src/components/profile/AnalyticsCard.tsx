import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}

export default function AnalyticsCard({ title, value, icon, color = '#4A6FA5' }: AnalyticsCardProps) {
  return (
    <View className="bg-white border border-border rounded-xl p-4 flex-1 mx-1">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon} size={20} color={color} />
        <Text className="text-xs text-textSecondary ml-1.5">{title}</Text>
      </View>
      <Text className="text-2xl font-bold text-textPrimary">{value}</Text>
    </View>
  );
}
