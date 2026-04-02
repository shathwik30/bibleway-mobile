import React, { useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  FlatListProps,
} from "react-native";
import { colors } from "@/theme/colors";
import { UseInfiniteQueryResult, InfiniteData } from "@tanstack/react-query";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import { FeedSkeleton } from "../ui/Skeleton";
import { flattenPages } from "@/lib/pages";

interface InfiniteListProps<T> {
  queryResult: UseInfiniteQueryResult<InfiniteData<{ results: T[] }>, Error>;
  renderItem: FlatListProps<T>["renderItem"];
  keyExtractor: (item: T) => string;
  emptyTitle?: string;
  emptyMessage?: string;
  headerComponent?: React.ReactElement;
  estimatedItemSize?: number;
  loadingComponent?: React.ReactElement;
  bottomInset?: number;
}

export default function InfiniteList<T>({
  queryResult,
  renderItem,
  keyExtractor,
  emptyTitle = "Nothing here yet",
  emptyMessage,
  headerComponent,
  estimatedItemSize,
  loadingComponent,
  bottomInset = 0,
}: InfiniteListProps<T>) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = queryResult;

  const allItems = flattenPages(data);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
      </View>
    );
  };

  if (isLoading) {
    return loadingComponent ?? <FeedSkeleton />;
  }

  if (isError) {
    return <ErrorState message={error?.message} onRetry={() => refetch()} />;
  }

  return (
    <FlatList
      data={allItems}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={headerComponent}
      ListEmptyComponent={
        <EmptyState title={emptyTitle} message={emptyMessage} />
      }
      ListFooterComponent={renderFooter}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching && !isFetchingNextPage}
          onRefresh={() => refetch()}
          tintColor={colors.primary.DEFAULT}
        />
      }
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      maxToRenderPerBatch={10}
      windowSize={7}
      removeClippedSubviews
      {...(estimatedItemSize
        ? {
            getItemLayout: (_data, index) => ({
              length: estimatedItemSize,
              offset: estimatedItemSize * index,
              index,
            }),
          }
        : {})}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomInset + 24 }}
    />
  );
}
