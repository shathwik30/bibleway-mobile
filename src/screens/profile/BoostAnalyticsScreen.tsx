import React from 'react';
import { View, Text, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import AnalyticsCard from '@/components/profile/AnalyticsCard';
import { useBoostAnalytics } from '@/hooks/useAnalytics';
import type { ProfileStackParamList } from '@/types/navigation';

export default function BoostAnalyticsScreen() {
  const route = useRoute<RouteProp<ProfileStackParamList, 'BoostAnalytics'>>();
  const { boostId } = route.params;
  const { data: analytics, isLoading } = useBoostAnalytics(boostId);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Boost Analytics" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  if (!analytics) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Boost Analytics" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-textSecondary">No boost data available</Text>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Boost Analytics" />
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Summary cards */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="Impressions" value={analytics.total_impressions ?? 0} icon="eye-outline" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="Clicks" value={analytics.total_clicks ?? 0} icon="hand-left-outline" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="New Followers" value={analytics.new_followers ?? 0} icon="person-add-outline" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="Engagements" value={analytics.total_engagements ?? 0} icon="heart-outline" />
          </View>
        </View>

        {/* Snapshots timeline */}
        <Text className="text-lg font-bold text-textPrimary mb-3">Daily Snapshots</Text>
        {analytics.snapshots && analytics.snapshots.length > 0 ? (
          analytics.snapshots.map((snapshot: any, index: number) => (
            <View key={index} className="p-4 bg-surface rounded-xl mb-2">
              <Text className="text-sm font-semibold text-primary mb-2">
                {snapshot.date ? new Date(snapshot.date).toLocaleDateString() : `Day ${index + 1}`}
              </Text>
              <View className="flex-row justify-between">
                <Text className="text-sm text-textSecondary">Impressions: {snapshot.impressions ?? 0}</Text>
                <Text className="text-sm text-textSecondary">Clicks: {snapshot.clicks ?? 0}</Text>
                <Text className="text-sm text-textSecondary">Engagements: {snapshot.engagements ?? 0}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className="items-center py-8">
            <Text className="text-base text-textSecondary">No snapshots yet</Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaScreen>
  );
}
