import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { useBibleChapters } from '@/hooks/useBible';
import type { BibleStackParamList } from '@/types/navigation';
import type { BibleChapterSummary } from '@/types/models';

export default function BibleChapterListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<BibleStackParamList, 'BibleChapterList'>>();
  const { bibleId, bookId } = route.params;
  const { data: chapters, isLoading } = useBibleChapters(bibleId, bookId);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Chapters" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Chapters" />
      <FlatList
        data={chapters as BibleChapterSummary[] | undefined}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('BibleVerse', { bibleId, chapterId: item.id })}
            className="flex-1 items-center justify-center p-4 bg-surface rounded-xl mb-3"
          >
            <Text className="text-lg font-semibold text-textPrimary">{item.number}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <Text className="text-base text-textSecondary">No chapters found</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
