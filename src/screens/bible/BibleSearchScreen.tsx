import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '@/theme/colors';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import SearchBar from '@/components/ui/SearchBar';
import EmptyState from '@/components/ui/EmptyState';
import { useBibleSearch, useApiBibleSearch } from '@/hooks/useBible';
import type { BibleStackParamList } from '@/types/navigation';

interface SearchResultItem {
  id: string;
  reference: string;
  text: string;
  bibleId?: string;
  chapterId?: string;
}

export default function BibleSearchScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<BibleStackParamList, 'BibleSearch'>>();
  const bibleId = route.params?.bibleId;
  const [query, setQuery] = useState('');

  const isApiSearch = !!bibleId;
  const apiBibleSearch = useApiBibleSearch(bibleId ?? '', query);
  const segregatedSearch = useBibleSearch(isApiSearch ? '' : query);

  const isLoading = isApiSearch ? apiBibleSearch.isLoading : segregatedSearch.isLoading;
  const isFetching = isApiSearch ? apiBibleSearch.isFetching : segregatedSearch.isFetching;

  const results: SearchResultItem[] = isApiSearch
    ? (apiBibleSearch.data?.verses ?? []).map((v) => ({
        id: v.id,
        reference: v.reference,
        text: v.text,
        bibleId: v.bibleId,
        chapterId: v.chapterId,
      }))
    : ((segregatedSearch.data as SearchResultItem[] | undefined) ?? []);

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Search Bible" />
      <View className="px-4 pt-2">
        <SearchBar
          onSearch={setQuery}
          placeholder="Search verses, topics..."
        />
      </View>

      {(isLoading || isFetching) && query.length > 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                if (item.bibleId && item.chapterId) {
                  navigation.navigate('BibleVerse', { bibleId: item.bibleId, chapterId: item.chapterId });
                }
              }}
              className="p-4 bg-surface rounded-xl mb-3"
            >
              <Text className="text-sm font-semibold text-primary mb-1">{item.reference}</Text>
              <Text className="text-base text-textPrimary" numberOfLines={3}>{item.text}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            query.length > 0
              ? <EmptyState icon="search-outline" title="No results found" />
              : <EmptyState icon="search-outline" title="Start typing to search" />
          }
        />
      )}
    </SafeAreaScreen>
  );
}
