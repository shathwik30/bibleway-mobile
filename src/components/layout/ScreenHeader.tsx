import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/stores/appStore';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export default function ScreenHeader({ title, showBack = true, rightAction }: ScreenHeaderProps) {
  const navigation = useNavigation();
  const isDark = useAppStore((s) => s.isDark);

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-darkBg border-b border-border dark:border-borderDark">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <Pressable onPress={() => navigation.goBack()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={24} color={isDark ? '#E5E7EB' : '#1A1A2E'} />
          </Pressable>
        )}
        <Text className="text-xl font-bold text-textPrimary dark:text-gray-100" numberOfLines={1}>{title}</Text>
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );
}
