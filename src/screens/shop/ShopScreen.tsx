import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import SearchBar from '@/components/ui/SearchBar';
import EmptyState from '@/components/ui/EmptyState';
import ProductCard from '@/components/shop/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useProducts } from '@/hooks/useShop';
import type { Product } from '@/types/models';

export default function ShopScreen() {
  const navigation = useNavigation<any>();
  const { data, isLoading, refetch, isRefetching } = useProducts();
  const products = data?.pages?.flatMap((page: any) => page.results || []) ?? [];
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p: any) => p.title?.toLowerCase().includes(q));
  }, [products, search]);

  if (isLoading) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="Shop" />
        <View className="flex-row flex-wrap p-3 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="flex-1 min-w-[45%] mb-3">
              <ProductCardSkeleton />
            </View>
          ))}
        </View>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Shop" />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12, flexGrow: 1 }}
        columnWrapperStyle={{ gap: 12 }}
        ListHeaderComponent={
          <View className="mb-3">
            <SearchBar onSearch={setSearch} placeholder="Search products..." />
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor="#4A6FA5"
          />
        }
        renderItem={({ item }: { item: any }) => (
          <View className="flex-1 mb-3">
            <ProductCard
              product={item}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState icon="storefront-outline" title="No products available" message="Check back later for new items" />
        }
      />
    </SafeAreaScreen>
  );
}
