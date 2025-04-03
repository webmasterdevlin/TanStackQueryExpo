import { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { names } from '../state/server/queryKey';
import todoService from '../services/todo';

export default function PollingScreen() {
  const [intervalMs, setIntervalMs] = useState(10000);
  const [inputValue, setInputValue] = useState(String(10000));
  const [isValidInput, setIsValidInput] = useState(true);
  const pulseAnim = useState(new Animated.Value(1))[0];
  const opacityAnim = useState(new Animated.Value(1))[0];

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

  // Create a pulsing animation effect when fetching
  useEffect(() => {
    let scaleAnimation: any;
    let opacityAnimation: any;

    if (todoListQuery.isFetching) {
      // Scale animation
      scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.5,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );

      // Opacity animation - works better for web
      opacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );

      scaleAnimation.start();
      opacityAnimation.start();
    } else {
      // Reset animations
      Animated.parallel([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (scaleAnimation) {
        scaleAnimation.stop();
      }
      if (opacityAnimation) {
        opacityAnimation.stop();
      }
    };
  }, [todoListQuery.isFetching]);

  // Helper function for cross-platform styling
  const getIndicatorStyle = () => {
    const baseStyle = {
      transform: [{ scale: pulseAnim }],
      opacity: opacityAnim,
      marginLeft: 10,
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: todoListQuery.isFetching ? '#22c55e' : 'transparent',
    };

    // Add platform-specific styling
    if (Platform.OS === 'android') {
      return {
        ...baseStyle,
        elevation: todoListQuery.isFetching ? 4 : 0,
      };
    } else if (Platform.OS === 'ios') {
      return {
        ...baseStyle,
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: todoListQuery.isFetching ? 0.8 : 0,
        shadowRadius: 6,
      };
    } else {
      // Web platform
      return {
        ...baseStyle,
        boxShadow: todoListQuery.isFetching ? '0 0 6px #22c55e' : 'none',
      };
    }
  };

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

      <View className="mb-4 flex-row items-center">
        <Animated.View style={getIndicatorStyle()} />
      </View>

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
