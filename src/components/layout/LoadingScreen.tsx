import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import SafeAreaScreen from './SafeAreaScreen';
import ScreenHeader from './ScreenHeader';
import { colors } from '@/theme/colors';

interface LoadingScreenProps {
  title: string;
  showBack?: boolean;
}

export default function LoadingScreen({ title, showBack = true }: LoadingScreenProps) {
  return (
    <SafeAreaScreen>
      <ScreenHeader title={title} showBack={showBack} />
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    </SafeAreaScreen>
  );
}
