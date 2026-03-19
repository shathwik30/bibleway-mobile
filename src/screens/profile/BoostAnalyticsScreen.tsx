import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import AnalyticsCard from '@/components/profile/AnalyticsCard';
import { useBoostAnalytics } from '@/hooks/useAnalytics';
import type { BoostAnalyticSnapshot } from '@/types/models';
import type { ProfileStackParamList } from '@/types/navigation';

export default function BoostAnalyticsScreen() {
  const route = useRoute<RouteProp<ProfileStackParamList, 'BoostAnalytics'>>();
  const { boostId } = route.params;
  const { data: analytics, isLoading } = useBoostAnalytics(boostId);

  const snapshots: BoostAnalyticSnapshot[] = analytics?.results ?? [];

  // Compute totals from snapshots
  const totalImpressions = snapshots.reduce((sum, s) => sum + s.impressions, 0);
  const totalClicks = snapshots.reduce((sum, s) => sum + s.link_clicks, 0);
  const totalProfileVisits = snapshots.reduce((sum, s) => sum + s.profile_visits, 0);
  const totalReach = snapshots.reduce((sum, s) => sum + s.reach, 0);

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

  if (!analytics || snapshots.length === 0) {
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
            <AnalyticsCard title="Impressions" value={totalImpressions} icon="eye-outline" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="Link Clicks" value={totalClicks} icon="hand-left-outline" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="Profile Visits" value={totalProfileVisits} icon="person-add-outline" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <AnalyticsCard title="Reach" value={totalReach} icon="people-outline" />
          </View>
        </View>

        {/* Snapshots timeline */}
        <Text className="text-lg font-bold text-textPrimary mb-3">Daily Snapshots</Text>
        {snapshots.map((snapshot) => (
          <View key={snapshot.id} className="p-4 bg-surface rounded-xl mb-2">
            <Text className="text-sm font-semibold text-primary mb-2">
              {new Date(snapshot.snapshot_date).toLocaleDateString()}
            </Text>
            <View className="flex-row justify-between">
              <Text className="text-sm text-textSecondary">Impressions: {snapshot.impressions}</Text>
              <Text className="text-sm text-textSecondary">Clicks: {snapshot.link_clicks}</Text>
              <Text className="text-sm text-textSecondary">Rate: {snapshot.engagement_rate}%</Text>
            </View>
          </View>
        ))}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaScreen>
  );
}
