import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import SearchBar from '@/components/ui/SearchBar';
import { useBibleSearch } from '@/hooks/useBible';

export default function BibleSearchScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const { data: results, isLoading, isFetching } = useBibleSearch(query) as { data: any; isLoading: boolean; isFetching: boolean };

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
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.id || String(index)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('BibleVerse', { bibleId: item.bibleId, chapterId: item.chapterId })}
              className="p-4 bg-surface rounded-xl mb-3"
            >
              <Text className="text-sm font-semibold text-primary mb-1">{item.reference}</Text>
              <Text className="text-base text-textPrimary" numberOfLines={3}>{item.text}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            query.length > 0 ? (
              <View className="items-center pt-20">
                <Text className="text-base text-textSecondary">No results found</Text>
              </View>
            ) : (
              <View className="items-center pt-20">
                <Text className="text-base text-textSecondary">Start typing to search</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaScreen>
  );
}
