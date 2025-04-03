import { Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-indigo-900 p-6">
      <View className="w-full max-w-md  items-center rounded-xl p-8 shadow-lg">
        <Text className="mb-2 text-2xl text-blue-500">App.js Conf 2025 🚀</Text>
        <Text className="mb-6 text-center text-xl text-gray-400">TanStack Query in Expo</Text>
      </View>
    </View>
  );
}
