import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import reportService from '@/services/report';
import { Report } from '@/models';
import { names } from '@/state/server/queryKey';

export default function ReportsScreen() {
  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: [names.reports],
    queryFn: () => reportService.getReports(),
    staleTime: Infinity, // Reports won't be considered stale
    gcTime: Infinity, // Reports won't be garbage collected
  });

  const handlePreLoad = useCallback(
    async (reportId: number) => {
      /* When you know or suspect that a certain piece of data will be needed,
    you can use prefetching to populate the cache ahead of time,
    leading to a faster experience for the user. */
      await queryClient.prefetchQuery({
        queryKey: [names.report, reportId],
        queryFn: () => reportService.getReportById(reportId),
        staleTime: Infinity,
        gcTime: Infinity,
      });
    },
    [queryClient]
  );

  const renderReportItem = ({ item }: { item: Report }) => (
    <Link
      href={{
        pathname: '/prefetching/[id]',
        params: { id: item.id },
      }}
      onLayout={() => {
        if (item.id < 20) handlePreLoad(item.id);
      }}
      className="border-b border-gray-200 py-3">
      <Text className="text-lg text-blue-700">{item.title}</Text>
    </Link>
  );

  return (
    <View className="flex-1 p-4">
      <Text className="mb-6 text-2xl font-bold">Reports</Text>

      {reportsQuery.isPending && <Text>Loading reports...</Text>}

      {reportsQuery.isError && (
        <Text className="text-red-500">Error loading reports: {reportsQuery.error?.message}</Text>
      )}

      {reportsQuery.data && (
        <FlatList
          data={reportsQuery.data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReportItem}
          className="w-full"
        />
      )}
    </View>
  );
}
