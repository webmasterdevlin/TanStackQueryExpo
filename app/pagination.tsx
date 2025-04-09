import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { names } from '@/state/server/queryKey';
import commodityService from '@/services/commodity';
import Spinner from '@/components/Spinner';
import { Commodity } from '@/models';
import { FlatList } from 'react-native-gesture-handler';

export default function PaginationScreen() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isRefetching, isFetching, isError, error, isPending } = useQuery({
    queryKey: [names.commodities, page, pageSize],
    queryFn: () => commodityService.getCommodities(page, pageSize),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  const handleSetPage = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  const renderItem = ({ item }: { item: Commodity }) => (
    <View className="mb-3 overflow-hidden rounded-lg bg-white p-4 shadow-sm">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-indigo-700">{item.name}</Text>
        <View className="rounded-full bg-indigo-100 px-2 py-1">
          <Text className="text-xs font-medium text-indigo-800">ID: {item.id}</Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="rounded-md bg-green-50 px-3 py-1">
          <Text className="text-green-700">${item.price.toFixed(2)}</Text>
        </View>
        <View className="rounded-md bg-amber-50 px-3 py-1">
          <Text className="text-amber-700">Quantity: {item.quantity}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-10">
      <MaterialCommunityIcons name="tray" size={48} color="#d1d5db" />
      <Text className="mt-4 text-center text-gray-400">No items to display</Text>
    </View>
  );

  const renderPagination = () => (
    <View className="mb-6 mt-4 flex-row items-center justify-between">
      <TouchableOpacity
        className={`flex-row items-center rounded-lg ${page === 1 ? 'bg-gray-200' : 'bg-indigo-600'} px-4 py-2`}
        onPress={() => handleSetPage(page - 1)}
        disabled={page === 1 || isFetching}>
        <Octicons name="chevron-left" size={16} color={page === 1 ? '#9ca3af' : '#ffffff'} />
        <Text className={`ml-1 ${page === 1 ? 'text-gray-500' : 'text-white'}`}>Previous</Text>
      </TouchableOpacity>

      <View className="items-center">
        <Text className="text-base font-medium text-gray-700">
          Page {page} {data?.next ? 'of many' : ''}
        </Text>
        <Text className="text-sm text-gray-500">Showing {data?.data.length || 0} items</Text>
      </View>

      <TouchableOpacity
        className={`flex-row items-center rounded-lg ${!data?.next ? 'bg-gray-200' : 'bg-indigo-600'} px-4 py-2`}
        onPress={() => handleSetPage(page + 1)}
        disabled={!data?.next || isFetching}>
        <Text className={`mr-1 ${!data?.next ? 'text-gray-500' : 'text-white'}`}>Next</Text>
        <Octicons name="chevron-right" size={16} color={!data?.next ? '#9ca3af' : '#ffffff'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-800">Page {page}</Text>
        {(isFetching || isRefetching) && <Spinner />}
      </View>

      {isError && (
        <View className="mb-4 rounded-lg bg-red-50 p-3">
          <Text className="text-red-600">
            Error: {error instanceof Error ? error.message : 'Failed to load data'}
          </Text>
        </View>
      )}

      <FlatList
        data={data?.data || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyState()}
        className="w-full flex-1"
        contentContainerClassName="pb-4"
      />

      {renderPagination()}
    </View>
  );
}
