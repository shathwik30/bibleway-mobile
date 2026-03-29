import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import LoadingScreen from '@/components/layout/LoadingScreen';
import EmptyState from '@/components/ui/EmptyState';
import { useNotes, useDeleteNote } from '@/hooks/useBible';
import { flattenPages } from '@/lib/pages';
import { confirmAction } from '@/lib/confirm';
import { colors } from '@/theme/colors';

export default function NotesScreen() {
  const { data, isLoading } = useNotes();
  const notes = flattenPages(data);
  const deleteMutation = useDeleteNote();

  if (isLoading) {
    return <LoadingScreen title="Notes" />;
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Notes" />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-base font-semibold text-textPrimary">{item.verse_reference || 'Untitled Note'}</Text>
              <Text className="text-sm text-textSecondary mt-1" numberOfLines={2}>{item.text}</Text>
              <Text className="text-xs text-textSecondary mt-1">{item.note_type}</Text>
            </View>
            <Pressable onPress={() => confirmAction(
              'Delete Note',
              'Are you sure?',
              () => deleteMutation.mutate(item.id),
              'Delete',
            )} className="p-2">
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState icon="document-text-outline" title="No notes yet" />
        }
      />
    </SafeAreaScreen>
  );
}
