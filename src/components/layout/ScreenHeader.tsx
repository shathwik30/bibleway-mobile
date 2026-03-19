import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export default function ScreenHeader({ title, showBack = true, rightAction }: ScreenHeaderProps) {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-border">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <Pressable onPress={() => navigation.goBack()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
          </Pressable>
        )}
        <Text className="text-xl font-bold text-textPrimary" numberOfLines={1}>{title}</Text>
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );
}
