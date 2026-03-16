import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { useChapters } from '@/hooks/useBible';
import type { BibleStackParamList } from '@/types/navigation';

export default function SegregatedChaptersScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<BibleStackParamList, 'SegregatedChapters'>>();
  const { sectionId, sectionTitle } = route.params;
  const { data: chapters, isLoading } = useChapters(sectionId);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title={sectionTitle} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title={sectionTitle} />
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('SegregatedPages', { chapterId: item.id, chapterTitle: item.title })}
            className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3"
          >
            <View className="flex-1 mr-3">
              <Text className="text-base font-semibold text-textPrimary">{item.title}</Text>
              {item.description && (
                <Text className="text-sm text-textSecondary mt-1" numberOfLines={2}>{item.description}</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <Text className="text-base text-textSecondary">No chapters available</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
