import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import SearchBar from "@/components/ui/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/shop/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { useProducts } from "@/hooks/useShop";
import { flattenPages } from "@/lib/pages";
import type { ProductListItem } from "@/types/models";

export default function ShopScreen() {
  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProducts();
  const products = flattenPages(data);
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p: ProductListItem) =>
      p.title?.toLowerCase().includes(q),
    );
  }, [products, search]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !search.trim()) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, search]);

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
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={() => refetch()}
            tintColor={colors.primary.DEFAULT}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        renderItem={({ item }: { item: ProductListItem }) => (
          <View className="flex-1 mb-3">
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="storefront-outline"
            title="No products available"
            message="Check back later for new items"
          />
        }
      />
    </SafeAreaScreen>
  );
}
