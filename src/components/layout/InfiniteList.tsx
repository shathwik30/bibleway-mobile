import React, { useCallback } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View, FlatListProps } from 'react-native';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import { FeedSkeleton } from '../ui/Skeleton';

interface InfiniteListProps<T> {
  queryResult: UseInfiniteQueryResult<any, Error>;
  renderItem: FlatListProps<T>['renderItem'];
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
  emptyTitle = 'Nothing here yet',
  emptyMessage,
  headerComponent,
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

  const allItems = data?.pages?.flatMap((page: any) => page.results || page.data?.results || []) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#4A6FA5" />
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
      data={allItems as T[]}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={headerComponent}
      ListEmptyComponent={<EmptyState title={emptyTitle} message={emptyMessage} />}
      ListFooterComponent={renderFooter}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching && !isFetchingNextPage}
          onRefresh={() => refetch()}
          tintColor="#4A6FA5"
        />
      }
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomInset + 24 }}
    />
  );
}
