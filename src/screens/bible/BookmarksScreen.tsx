import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { useBookmarks, useDeleteBookmark } from '@/hooks/useBible';

export default function BookmarksScreen() {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useBookmarks();
  const bookmarks = data?.pages?.flatMap((page: any) => page.results || []) ?? [];
  const deleteMutation = useDeleteBookmark();

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Bookmarks" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Bookmarks" />
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3">
            <Pressable
              onPress={() => navigation.navigate('SegregatedPageDetail', { pageId: item.page_id })}
              className="flex-1 mr-3"
            >
              <Text className="text-base font-semibold text-textPrimary">{item.title}</Text>
              <Text className="text-sm text-textSecondary mt-1">{item.reference || ''}</Text>
            </Pressable>
            <Pressable onPress={() => Alert.alert(
              'Delete Bookmark',
              'Are you sure you want to delete this bookmark?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(item.id) },
              ],
            )} className="p-2">
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <Ionicons name="bookmark-outline" size={48} color="#9CA3AF" />
            <Text className="text-base text-textSecondary mt-4">No bookmarks yet</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
