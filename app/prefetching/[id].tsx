import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter, useFocusEffect, Link } from 'expo-router';
import React from 'react';
import reportService from '@/services/report';
import { names } from '@/state/server/queryKey';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = parseInt(id, 10);

  const reportQuery = useQuery({
    queryKey: [names.report, id],
    queryFn: () => reportService.getReportById(numericId),
    staleTime: 1000 * 60 * 1, // 1 minute
    // enabled: !isNaN(numericId) && numericId > 0,
  });

  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      reportQuery.refetch();
    }, [reportQuery.refetch])
  );

  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        <Link href="./" className="text-lg text-blue-500">
          <IconSymbol color="indigo" name="arrow.left" />
        </Link>
      </View>

      {reportQuery.isPending && (
        <Text className="text-base">
          Loading. Please wait. <Text className="text-pink-700">(one-time only)</Text>
        </Text>
      )}

      {reportQuery.isError && (
        <Text className="text-red-500">Error: {reportQuery.error?.message}</Text>
      )}

      {reportQuery.data && (
        <View className="flex flex-row items-start gap-6">
          <View className="flex flex-col flex-wrap justify-start">
            <View className="flex flex-wrap gap-10">
              <Text>{JSON.stringify(reportQuery.data, null, 2)}</Text>
            </View>
          </View>
        </View>
      )}

      <View className="mt-4 items-center justify-center">
        {reportQuery.isFetching && !reportQuery.isPending && (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#0000ff" />
            <Text className="ml-2 text-indigo-700">Fetching in the background</Text>
          </View>
        )}
      </View>
    </View>
  );
}
