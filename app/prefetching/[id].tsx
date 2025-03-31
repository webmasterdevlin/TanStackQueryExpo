import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import reportService from "@/services/report";
import { names } from "@/state/server/queryKey";

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const numericId = parseInt(id, 10);

  const goBack = () => {
    router.back();
  };

  const reportQuery = useQuery({
    queryKey: [names.report, numericId],
    queryFn: () => reportService.getReportById(numericId),
    enabled: !isNaN(numericId) && numericId > 0,
  });

  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        <TouchableOpacity onPress={goBack}>
          <Text className="text-blue-500 text-lg">🔙 Back</Text>
        </TouchableOpacity>
      </View>

      {reportQuery.isPending && (
        <Text className="text-base">
          Loading. Please wait.{" "}
          <Text className="text-orange-300">(one-time only)</Text>
        </Text>
      )}

      {reportQuery.isError && (
        <Text className="text-red-500">
          Error: {reportQuery.error?.message}
        </Text>
      )}

      {reportQuery.data && (
        <View className="flex-row items-start gap-6">
          <View className="flex-col justify-start">
            <View className="flex-wrap">
              <Text>{JSON.stringify(reportQuery.data, null, 2)}</Text>
            </View>
          </View>
        </View>
      )}

      <View className="items-center justify-center mt-4">
        {reportQuery.isFetching && !reportQuery.isPending && (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#0000ff" />
            <Text className="ml-2">Fetching in the background</Text>
          </View>
        )}
      </View>
    </View>
  );
}
