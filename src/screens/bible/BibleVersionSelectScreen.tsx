import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { useBibleVersions } from '@/hooks/useBible';
import type { BibleVersion } from '@/types/models';

export default function BibleVersionSelectScreen() {
  const navigation = useNavigation<any>();
  const { data: versions, isLoading, error, refetch } = useBibleVersions();

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  if (error) {
    return (
      <SafeAreaScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-red-500 mb-2 text-center">Failed to load Bible versions</Text>
          <Text className="text-sm text-textSecondary mb-4 text-center">{(error as any)?.response?.data?.message || error.message}</Text>
          <Pressable onPress={() => refetch()} className="px-6 py-3 bg-primary rounded-xl">
            <Text className="text-white font-semibold">Retry</Text>
          </Pressable>
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <FlatList
        data={versions as BibleVersion[] | undefined}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('BibleBookList', { bibleId: item.id })}
            className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-3"
          >
            <View className="flex-1 mr-3">
              <Text className="text-base font-semibold text-textPrimary">{item.name}</Text>
              {item.description ? (
                <Text className="text-sm text-textSecondary mt-1" numberOfLines={1}>{item.description}</Text>
              ) : null}
              <Text className="text-xs text-textTertiary mt-0.5">{item.language?.name} — {item.abbreviationLocal}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-base text-textSecondary">No Bible versions available</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
