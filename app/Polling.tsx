import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { names } from "../state/server/queryKey";
import { todoService } from "../services/todo";
import { cn } from "../utilities/style";

export default function Polling() {
  const [intervalMs, setIntervalMs] = useState(10000);

  const handleIntervalChange = (value: string) => {
    const newValue = Number(value);
    if (!isNaN(newValue) && newValue >= 1000 && newValue <= 10000) {
      setIntervalMs(newValue);
    }
  };

  const todoListQuery = useQuery({
    queryKey: [names.todos],
    queryFn: todoService.getTodos,
    refetchInterval: intervalMs,
  });

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-4">
        Auto Refetch with stale-time set to {intervalMs} ms
      </Text>

      <View className="flex-row items-center mb-4">
        <Text className="mr-2">Query Interval speed (ms):</Text>
        <TextInput
          value={String(intervalMs)}
          onChangeText={handleIntervalChange}
          keyboardType="numeric"
          className="border bg-red-400 text-black border-gray-300 px-2 py-1 rounded w-20"
        />
        {todoListQuery.isFetching && (
          <Text className="ml-2 text-xl text-gray-500">
            Fetching new data...
          </Text>
        )}
        <View
          className={cn(
            "ml-2.5 h-2.5 w-2.5 rounded-full",
            todoListQuery.isFetching ? "bg-green-500" : "bg-transparent"
          )}
        />
      </View>

      <Text className="text-lg font-bold mt-2 mb-2">Todo List</Text>

      <Link href="/new-todo" asChild>
        <Text className="text-violet-600 mb-4">➕ Add new</Text>
      </Link>

      <ScrollView>
        {todoListQuery.data?.map((todo, i) => (
          <Text key={todo.id} className="py-1">
            {i + 1}. {todo.title}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}
