import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { names } from "../state/server/queryKey";
import { todoService } from "../services/todo";
import { cn } from "../utilities/style";

export default function Polling() {
  const [intervalMs, setIntervalMs] = useState(10000);
  const [inputValue, setInputValue] = useState(String(10000));
  const [isValidInput, setIsValidInput] = useState(true);

  const handleIntervalChange = (value: string) => {
    setInputValue(value);
    const newValue = Number(value);

    if (!isNaN(newValue) && newValue >= 1000 && newValue <= 10000) {
      setIntervalMs(newValue);
      setIsValidInput(true);
    } else {
      setIsValidInput(false);
    }
  };

  const applyInterval = () => {
    const newValue = Number(inputValue);
    if (!isNaN(newValue) && newValue >= 1000 && newValue <= 10000) {
      setIntervalMs(newValue);
      setIsValidInput(true);
    } else {
      Alert.alert(
        "Invalid Input",
        "Please enter a value between 1000 and 10000 ms"
      );
      setInputValue(String(intervalMs));
      setIsValidInput(true);
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

      <View className="flex-row items-center mb-1">
        <Text className="mr-2">Query Interval speed (ms):</Text>
        <TextInput
          value={inputValue}
          onChangeText={handleIntervalChange}
          onEndEditing={applyInterval}
          keyboardType="numeric"
          className={`border ${isValidInput ? "bg-white" : "bg-red-200"} text-black border-gray-300 px-2 py-1 rounded w-20`}
        />
        <TouchableOpacity
          onPress={applyInterval}
          className="ml-2 bg-blue-500 px-2 py-1 rounded"
        >
          <Text className="text-white">Apply</Text>
        </TouchableOpacity>
      </View>

      {!isValidInput && (
        <Text className="text-red-500 mb-2 text-xs">
          Enter a value between 1000-10000 ms
        </Text>
      )}

      <View className="flex-row items-center mb-4">
        {todoListQuery.isFetching && (
          <Text className="text-gray-500">Fetching new data...</Text>
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
