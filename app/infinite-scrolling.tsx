import React, { useRef } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { names } from "@/state/server/queryKey";
import commodityService from "@/services/commodity";
import { Commodity } from "@/models";
import { useScrollToTop } from "@react-navigation/native";

export default function InfiniteScrollingScreen() {
  const PAGE_SIZE = 7;
  const flatListRef = useRef<FlatList>(null);
  useScrollToTop(flatListRef);

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

  const handleOnEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }: { item: Commodity }) => (
    <View className="mb-5 flex flex-col rounded-md bg-white p-4 shadow-md">
      <Text className="text-lg font-semibold">Name: {item.name}</Text>
      <Text className="text-gray-600">Price: {item.price}</Text>
      <Text className="text-gray-600">Quantity: {item.quantity}</Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {isFetchingPreviousPage ? (
        <View className="py-2">
          <Text className="text-center">Loading previous...</Text>
        </View>
      ) : hasPreviousPage ? (
        <View className="py-2">
          <Text className="text-center" onPress={() => fetchPreviousPage()}>
            Pull to load previous...
          </Text>
        </View>
      ) : null}
    </>
  );

  const renderFooter = () => (
    <>
      {isFetchingNextPage ? (
        <View className="py-2">
          <Text className="text-center">Loading more...</Text>
        </View>
      ) : hasNextPage ? (
        <View className="py-2">
          <Text className="text-center">Scroll down to load more...</Text>
        </View>
      ) : (
        <View className="py-2">
          <Text className="text-center">Nothing more to load...</Text>
        </View>
      )}
    </>
  );

  if (status === "pending") {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-2">Loading... Please wait...</Text>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{(error as Error)?.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Infinite Scroll</Text>

      <FlatList
        ref={flatListRef}
        data={data?.pages.flatMap((page) => page.data) || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        className="flex-1"
      />
    </View>
  );
}
