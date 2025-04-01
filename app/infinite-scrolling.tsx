import React, { useRef, useCallback, useState } from "react";
import { Text, View, FlatList, ActivityIndicator, Dimensions } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { names } from "@/state/server/queryKey";
import commodityService from "@/services/commodity";
import { Commodity } from "@/models";
import { useScrollToTop } from "@react-navigation/native";

export default function InfiniteScrollingScreen() {
  const PAGE_SIZE = 3; // Show only 3 items at a time
  const flatListRef = useRef<FlatList>(null);
  const [isAtTop, setIsAtTop] = useState(false);
  useScrollToTop(flatListRef);

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
  });

  // Load more when reaching bottom
  const handleOnEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Track scroll position to detect top edge
  const handleScroll = useCallback((event) => {
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
  }, [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage, isAtTop]);

  const renderItem = ({ item }: { item: Commodity }) => (
    <View
      className="mx-3 rounded-xl bg-white p-5 shadow-md border border-gray-100 mb-5"
      style={{ height: itemHeight }}
    >
      <Text className="text-2xl font-bold text-indigo-800 mb-4">{item.name}</Text>
      <View className="flex-1 justify-center">
        <View className="bg-indigo-100 rounded-lg p-3 mb-4">
          <Text className="text-indigo-700 font-semibold text-xl text-center">
            ${item.price.toFixed(2)}
          </Text>
        </View>
        <View className="bg-emerald-100 rounded-lg p-3">
          <Text className="text-emerald-700 font-semibold text-xl text-center">
            Quantity: {item.quantity}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View className="py-4">
      <Text className="text-2xl font-bold mb-4 text-center">Infinite Scroll</Text>

      {isFetchingPreviousPage ? (
        <View className="p-3 items-center">
          <ActivityIndicator size="small" color="#6366f1" />
          <Text className="mt-2 text-indigo-600">Loading previous items...</Text>
        </View>
      ) : hasPreviousPage ? (
        <View className="p-3 items-center">
          <Text className="text-indigo-600 font-semibold">Scroll to top to load previous items</Text>
        </View>
      ) : (
        <View className="p-3 items-center">
          <Text className="text-gray-500">You've reached the beginning</Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View className="py-4">
      {isFetchingNextPage ? (
        <View className="p-3 items-center">
          <ActivityIndicator size="small" color="#6366f1" />
          <Text className="mt-2 text-indigo-600">Loading more items...</Text>
        </View>
      ) : hasNextPage ? (
        <View className="p-3 items-center">
          <Text className="text-indigo-600 font-semibold">Scroll to bottom to load more</Text>
        </View>
      ) : (
        <View className="p-3 items-center">
          <Text className="text-gray-500">You've reached the end</Text>
        </View>
      )}
    </View>
  );

  if (status === "pending") {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-4 text-indigo-600 font-medium">Loading... Please wait...</Text>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 font-medium">Error: {(error as Error)?.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        ref={flatListRef}
        data={data?.pages.flatMap((page) => page.data) || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.1} // Trigger closer to the bottom
        onScroll={handleScroll}
        scrollEventThrottle={16} // For smooth scroll tracking
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}
