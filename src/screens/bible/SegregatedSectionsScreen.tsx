import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import { useSections } from '@/hooks/useBible';

export default function SegregatedSectionsScreen() {
  const navigation = useNavigation<any>();
  const { data: sections, isLoading } = useSections();

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('SegregatedChapters', { sectionId: item.id, sectionTitle: item.title })}
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
            <Text className="text-base text-textSecondary">No sections available</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
