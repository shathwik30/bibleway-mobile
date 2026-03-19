import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import AnalyticsCard from '@/components/profile/AnalyticsCard';
import { usePostAnalytics } from '@/hooks/useAnalytics';
import type { ProfileStackParamList } from '@/types/navigation';

export default function PostAnalyticsScreen() {
  const route = useRoute<RouteProp<ProfileStackParamList, 'PostAnalytics'>>();
  const { postId } = route.params;
  const { data: analytics, isLoading } = usePostAnalytics(postId);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Post Analytics" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  if (!analytics) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Post Analytics" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-textSecondary">Analytics not available</Text>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Post Analytics" />
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row flex-wrap gap-3">
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="Views" value={analytics.views ?? 0} icon="eye-outline" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="Reactions" value={analytics.reactions ?? 0} icon="heart-outline" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="Comments" value={analytics.comments ?? 0} icon="chatbubble-outline" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="Shares" value={analytics.shares ?? 0} icon="share-outline" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
