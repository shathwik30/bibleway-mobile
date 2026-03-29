import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import LoadingScreen from '@/components/layout/LoadingScreen';
import EmptyState from '@/components/ui/EmptyState';
import { useChapters } from '@/hooks/useBible';
import { colors } from '@/theme/colors';
import type { BibleStackParamList } from '@/types/navigation';

export default function SegregatedChaptersScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<BibleStackParamList, 'SegregatedChapters'>>();
  const { sectionId, sectionTitle } = route.params;
  const { data: chapters, isLoading } = useChapters(sectionId);

  if (isLoading) return <LoadingScreen title={sectionTitle} />;

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
              <Text className="text-sm text-textSecondary mt-1">{item.page_count} {item.page_count === 1 ? 'page' : 'pages'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState icon="layers-outline" title="No chapters available" />
        }
      />
    </SafeAreaScreen>
  );
}
