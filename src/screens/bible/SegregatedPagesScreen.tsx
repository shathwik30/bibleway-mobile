import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { usePages } from '@/hooks/useBible';
import type { BibleStackParamList } from '@/types/navigation';

export default function SegregatedPagesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<BibleStackParamList, 'SegregatedPages'>>();
  const { chapterId, chapterTitle } = route.params;
  const { data: pages, isLoading } = usePages(chapterId);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title={chapterTitle} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title={chapterTitle} />
      <FlatList
        data={pages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('SegregatedPageDetail', { pageId: item.id, pageTitle: item.title })}
            className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3"
          >
            <View className="flex-1 mr-3">
              <Text className="text-base font-semibold text-textPrimary">{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <Text className="text-base text-textSecondary">No pages available</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
