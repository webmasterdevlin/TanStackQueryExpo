import React, { useRef, useCallback, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { names } from '@/state/server/queryKey';
import commodityService from '@/services/commodity';
import { Commodity } from '@/models';
import { useIsFocused, useScrollToTop } from '@react-navigation/native';
import { LegendList, LegendListRef } from '@legendapp/list';

export default function InfiniteScrollingScreen() {
  const PAGE_SIZE = 3; // Show only 3 items at a time
  const listRef = useRef<LegendListRef>(null);
  const [isAtTop, setIsAtTop] = useState(false);
  useScrollToTop(listRef);

  // Get screen height to help size items
  const screenHeight = Dimensions.get('window').height;
  const itemHeight = screenHeight / 3.5; // Slightly more than 3 per screen to indicate scrolling

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
  } = useInfiniteQuery({
    queryKey: [names.commodities],
    queryFn: async ({ pageParam }) => {
      return await commodityService.getCommodities(pageParam, PAGE_SIZE);
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.prev ?? undefined,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    maxPages: 3,
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

  // Track scroll position to detect top edge
  const handleScroll = useCallback(
    (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;

      // Check if we're at the top
      if (offsetY <= 10) {
        if (!isAtTop && hasPreviousPage && !isFetchingPreviousPage) {
          setIsAtTop(true);
          fetchPreviousPage();
        }
      } else {
        setIsAtTop(false);
      }
    },
    [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage, isAtTop]
  );

  const renderItem = ({ item }: { item: Commodity }) => (
    <View
      className="mx-3 mb-5 rounded-xl border border-gray-100 bg-white p-5 shadow-md"
      style={{ height: itemHeight }}>
      <Text className="mb-4 text-2xl font-bold text-indigo-800">{item.name}</Text>
      <View className="flex-1 justify-center">
        <View className="mb-4 rounded-lg bg-indigo-100 p-3">
          <Text className="text-center text-xl font-semibold text-indigo-700">
            ${item.price.toFixed(2)}
          </Text>
        </View>
        <View className="rounded-lg bg-emerald-100 p-3">
          <Text className="text-center text-xl font-semibold text-emerald-700">
            Quantity: {item.quantity}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View className="py-4">
      <Text className="mb-4 text-center text-2xl font-bold">Infinite Scroll</Text>

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
          <Text className="text-gray-500">This is the start 😎</Text>
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
          <Text className="font-semibold text-indigo-600">Scroll to bottom to load more</Text>
        </View>
      ) : (
        <View className="items-center p-3">
          <Text className="text-gray-500">You've reached the end</Text>
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
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="font-medium text-red-500">Error: {(error as Error)?.message}</Text>
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
        onEndReachedThreshold={0.1} // Trigger closer to the bottom
        // onScroll={handleScroll}
        scrollEventThrottle={16} // For smooth scroll tracking
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={true}
        maintainVisibleContentPosition={true}
      />
    </View>
  );
}
