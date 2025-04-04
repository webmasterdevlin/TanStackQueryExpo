import React, { useRef, useCallback } from 'react';
import { Text, View, ActivityIndicator, Dimensions } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { names } from '@/state/server/queryKey';
import commodityService from '@/services/commodity';
import { Commodity } from '@/models';
import { useIsFocused, useScrollToTop } from '@react-navigation/native';
import { LegendList, LegendListRef } from '@legendapp/list';
import { cn } from '@/utilities/style';

export default function InfiniteScrollingScreen() {
  const PAGE_SIZE = 5; // Increased from 3 to show more items at a time
  const listRef = useRef<LegendListRef>(null);
  useScrollToTop(listRef);

  // Get screen height to help size items
  const screenHeight = Dimensions.get('window').height;
  const itemHeight = screenHeight / 4.5; // Slightly more than 4 per screen

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: [names.commodities],
    queryFn: async ({ pageParam }) => {
      return await commodityService.getCommodities(pageParam, PAGE_SIZE);
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.prev ?? undefined,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    maxPages: 10, // Limit the number of pages to prevent excessive memory usage
    refetchOnMount: 'always',
    subscribed: useIsFocused(),
  });

  // Load previous when reaching top
  const handleOnStartReached = useCallback(() => {
    if (hasPreviousPage && !isFetchingPreviousPage) {
      fetchPreviousPage();
    }
  }, [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage]);

  // Load more when reaching bottom
  const handleOnEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = ({ item }: { item: Commodity }) => (
    <View
      className="mx-3 mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-md"
      style={{
        height: itemHeight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
      <Text className="mb-2 text-2xl font-bold text-indigo-800">{item.name}</Text>

      <View className="flex-1 justify-between">
        <View className="flex-row justify-between">
          <View className="w-[48%] rounded-lg bg-indigo-100 p-3">
            <Text className="text-center font-medium text-indigo-700">
              Price: ${item.price.toFixed(2)}
            </Text>
          </View>

          <View className="w-[48%] rounded-lg bg-emerald-100 p-3">
            <Text className="text-center font-medium text-emerald-700">
              Quantity: {item.quantity}
            </Text>
          </View>
        </View>

        <View className="mt-2 rounded-lg bg-amber-50 p-2">
          <Text className="text-center text-amber-700">ID: {item.id}</Text>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View className="py-4">
      <Text className="mb-4 text-center text-2xl font-bold">Commodities</Text>

      {isFetchingPreviousPage ? (
        <View className="items-center p-3">
          <ActivityIndicator size="small" color="#6366f1" />
          <Text className="mt-2 text-indigo-600">Loading previous items...</Text>
        </View>
      ) : hasPreviousPage ? (
        <View className="items-center p-3">
          <Text className="font-semibold text-indigo-600">
            Scroll to top to load previous items
          </Text>
        </View>
      ) : (
        <View className="items-center p-3">
          <Text className="text-gray-500">You're at the beginning 🎉</Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View className="py-4">
      {isFetchingNextPage ? (
        <View className="items-center p-3">
          <ActivityIndicator size="small" color="#6366f1" />
          <Text className="mt-2 text-indigo-600">Loading more items...</Text>
        </View>
      ) : hasNextPage ? (
        <View className="items-center p-3">
          <Text className="font-semibold text-indigo-600">Scroll to load more</Text>
        </View>
      ) : (
        <View className="items-center p-3">
          <Text className="text-gray-500">You've reached the end 🏁</Text>
        </View>
      )}
    </View>
  );

  if (status === 'pending') {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-4 font-medium text-indigo-600">Loading... Please wait...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="mb-3 text-xl text-red-500">Error loading data</Text>
        <Text className="mb-6 text-center text-red-400">
          {(error as Error)?.message || 'Unknown error'}
        </Text>
        <View
          className="rounded-lg bg-indigo-600 px-6 py-3"
          onStartShouldSetResponder={() => {
            refetch();
            return true;
          }}>
          <Text className="text-center font-semibold text-white">Try Again</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <LegendList
        ref={listRef}
        data={data?.pages.flatMap((page) => page.data) || []}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        onStartReached={handleOnStartReached}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.3}
        scrollEventThrottle={16}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}
