import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import PrayerCard from '@/components/feed/PrayerCard';
import { usePrayerDetail } from '@/hooks/useSocial';
import type { HomeStackParamList } from '@/types/navigation';

export default function PrayerDetailScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'PrayerDetail'>>();
  const { prayerId } = route.params;
  const { data: prayer, isLoading, isError } = usePrayerDetail(prayerId);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Prayer Request" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  if (isError || !prayer) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Prayer Request" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-textSecondary">Prayer request not found</Text>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Prayer Request" />
      <ScrollView className="flex-1">
        <PrayerCard prayer={prayer} />
      </ScrollView>
    </SafeAreaScreen>
  );
}
