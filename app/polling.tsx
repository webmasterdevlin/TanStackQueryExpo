import { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { names } from '../state/server/queryKey';
import todoService from '../services/todo';
import { cn } from '../utilities/style';

export default function PollingScreen() {
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
      Alert.alert('Invalid Input', 'Please enter a value between 1000 and 10000 ms');
      setInputValue(String(intervalMs));
      setIsValidInput(true);
    }
  };

  const todoListQuery = useQuery({
    queryKey: [names.todos],
    queryFn: todoService.getTodos,
    refetchInterval: Number(inputValue),
  });

  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-xl font-bold">
        Auto Refetch with stale-time set to {intervalMs} ms
      </Text>

      <View className="mb-1 flex-row items-center">
        <Text className="mr-2">Query Interval speed (ms):</Text>
        <TextInput
          value={inputValue}
          onChangeText={handleIntervalChange}
          onEndEditing={applyInterval}
          keyboardType="numeric"
          className={`border ${isValidInput ? 'bg-white' : 'bg-red-200'} w-20 rounded border-gray-300 px-2 py-1 text-black`}
        />
        <TouchableOpacity onPress={applyInterval} className="ml-2 rounded bg-blue-500 px-2 py-1">
          <Text className="text-white">Apply</Text>
        </TouchableOpacity>
      </View>

      {!isValidInput && (
        <Text className="mb-2 text-xs text-red-500">Enter a value between 1000-10000 ms</Text>
      )}

      <View
        className={cn(
          'ml-2.5 h-2.5 w-2.5 rounded-full',
          todoListQuery.isFetching ? 'bg-green-500' : 'bg-transparent'
        )}
      />

      <Text className="mb-2 mt-2 text-lg font-bold">Todo List</Text>

      <Link href="/new-todo" asChild>
        <Text className="mb-4 text-violet-700">➕ Add new</Text>
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
