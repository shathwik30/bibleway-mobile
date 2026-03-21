import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { useBibleBooks } from '@/hooks/useBible';
import type { BibleStackParamList } from '@/types/navigation';
import type { BibleBook } from '@/types/models';

export default function BibleBookListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<BibleStackParamList, 'BibleBookList'>>();
  const { bibleId } = route.params;
  const { data: books, isLoading } = useBibleBooks(bibleId);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Books" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Books" />
      <FlatList
        data={books as BibleBook[] | undefined}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('BibleChapterList', { bibleId, bookId: item.id })}
            className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-2"
          >
            <Text className="text-base text-textPrimary">{item.name}</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <Text className="text-base text-textSecondary">No books found</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
