import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import reportService from '@/services/report';
import { Report } from '@/models';
import { names } from '@/state/server/queryKey';

export default function ReportsScreen() {
  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: [names.reports],
    queryFn: () => reportService.getReports(),
    staleTime: Infinity, // default is 0 seconds
    gcTime: Infinity, // default is 5 minutes (300000ms)
  });

  const handlePreLoad = async (reportId: number) => {
    /* When you know or suspect that a certain piece of data will be needed,
    you can use prefetching to populate the cache with that data ahead of time,
    leading to a faster experience. */
    await queryClient.prefetchQuery({
      queryKey: [names.report, reportId],
      queryFn: () => reportService.getReportById(reportId),
      staleTime: Infinity,
      gcTime: Infinity,
    });
  };

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
      <Text className="mb-6 text-2xl font-bold">Prefetching in TanStack Query</Text>

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
