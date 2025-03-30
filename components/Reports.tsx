import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import reportService from "../services/report";
import { Report } from "../models";
import { useQuery } from "@tanstack/react-query";
import { names } from "../state/server/queryKey";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const {
    data: reports,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [names.reports],
    queryFn: () => reportService.getReports(),
  });

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Loading reports...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-lg">Error loading reports</Text>
        <Text className="text-red-400">{(error as Error).message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Reports</Text>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-4 mb-2 rounded-md ${selectedReport?.id === item.id ? "bg-blue-100" : "bg-gray-100"}`}
            onPress={() => handleSelectReport(item)}
          >
            <Text className="text-lg font-semibold">{item.title}</Text>
            <Text className="text-gray-600">{item.description}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-gray-500">No reports available</Text>
          </View>
        }
      />

      {selectedReport && (
        <View className="mt-4 p-4 bg-gray-50 rounded-md">
          <Text className="text-xl font-bold mb-2">{selectedReport.title}</Text>
          <Text className="text-gray-700">{selectedReport.description}</Text>
          <Text className="mt-2 text-gray-500">ID: {selectedReport.id}</Text>
        </View>
      )}
    </View>
  );
}
