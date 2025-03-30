import { useState } from "react";
import { Text, View, Button, FlatList } from "react-native";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { names } from "../state/server/queryKey";
import commodityService from "../services/commodity";
import Spinner from "../components/Spinner";

export default function Pagination() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isRefetching } = useQuery({
    queryKey: [names.commodities, page],
    queryFn: () => commodityService.getCommodities(page, pageSize),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  const handleSetPage = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Pagination (Page {page})</Text>

      <FlatList
        data={data?.data}
        numColumns={1}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-lg shadow mb-3">
            <Text className="text-lg font-semibold">Name: {item.name}</Text>
            <Text className="text-gray-600">Price: {item.price}</Text>
            <Text className="text-gray-600">Quantity: {item.quantity}</Text>
          </View>
        )}
        className="space-y-4"
      />

      <View className="flex-row items-center gap-3 mt-4">
        <Button
          title="Previous"
          disabled={page === 1}
          onPress={() => handleSetPage(page - 1)}
        />
        <Button
          title="Next"
          disabled={isRefetching || !data?.next}
          onPress={() => handleSetPage(page + 1)}
        />
        {isRefetching && <Spinner />}
      </View>
    </View>
  );
}
