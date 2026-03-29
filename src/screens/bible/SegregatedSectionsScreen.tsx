import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { useSections } from '@/hooks/useBible';
import { colors } from '@/theme/colors';

export default function SegregatedSectionsScreen() {
  const navigation = useNavigation();
  const { data: sections, isLoading, isError, error, refetch } = useSections();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (isError) {
    return <ErrorState message={error?.message} onRetry={() => refetch()} />;
  }

  return (
    <FlatList
      data={sections ?? []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('SegregatedChapters', { sectionId: item.id, sectionTitle: item.title })}
          className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3"
        >
          <View className="flex-1 mr-3">
            <View className="flex-row items-center">
              <Text className="text-base font-semibold text-textPrimary">{item.title}</Text>
              {item.is_prioritized && (
                <View className="ml-2 px-2 py-0.5 bg-primary/10 rounded-full">
                  <Text className="text-[10px] font-semibold text-primary">For You</Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-textSecondary mt-1">
              Ages {item.age_min}–{item.age_max} · {item.chapter_count} chapters
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>
      )}
      ListEmptyComponent={
        <EmptyState icon="book-outline" title="No study sections available" />
      }
    />
  );
}
