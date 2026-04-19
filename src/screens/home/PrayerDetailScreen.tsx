import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import LoadingScreen from "@/components/layout/LoadingScreen";
import PrayerCard from "@/components/feed/PrayerCard";
import { usePrayerDetail } from "@/hooks/useSocial";
import { useRecordView } from "@/hooks/useAnalytics";
import type { HomeStackParamList } from "@/types/navigation";
import { fonts } from "@/theme/fonts";

export default function PrayerDetailScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, "PrayerDetail">>();
  const { prayerId } = route.params;
  const { data: prayer, isLoading, isError } = usePrayerDetail(prayerId);
  useRecordView("prayer", prayerId);

  if (isLoading) return <LoadingScreen title="Prayer Request" />;

  if (isError || !prayer) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Prayer Request" />
        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-base text-textSecondary"
            style={fonts.regular}
          >
            Prayer request not found
          </Text>
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
