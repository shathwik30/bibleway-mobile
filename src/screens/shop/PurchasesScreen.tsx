import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import { usePurchases } from '@/hooks/useShop';

export default function PurchasesScreen() {
  const navigation = useNavigation<any>();
  const { data, isLoading } = usePurchases();
  const purchases = data?.pages?.flatMap((page: any) => page.results || []) ?? [];

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="My Purchases" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A6FA5" />
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="My Purchases" />
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('ProductDetail', { productId: item.product_id })}
            className="flex-row items-center p-4 bg-surface rounded-xl mb-3"
          >
            <View className="flex-1">
              <Text className="text-base font-semibold text-textPrimary">{item.product_title}</Text>
              <Text className="text-sm text-textSecondary mt-1">
                Purchased {item.purchased_at ? new Date(item.purchased_at).toLocaleDateString() : ''}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <Ionicons name="bag-outline" size={48} color="#9CA3AF" />
            <Text className="text-base text-textSecondary mt-4">No purchases yet</Text>
          </View>
        }
      />
    </SafeAreaScreen>
  );
}
