import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { usePurchases } from '@/hooks/useShop';

export default function DownloadsScreen() {
  const { data } = usePurchases();
  const downloads = data?.pages?.flatMap((page: any) => page?.results || []) || [];

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Downloads" />
      <FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-4 bg-surface rounded-xl mb-3">
            <Ionicons name="document-outline" size={24} color="#4A6FA5" />
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-textPrimary">{item.title}</Text>
              <Text className="text-sm text-textSecondary mt-1">{item.file_size || 'Unknown size'}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <Ionicons name="download-outline" size={48} color="#9CA3AF" />
            <Text className="text-base text-textSecondary mt-4">No downloads yet</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
