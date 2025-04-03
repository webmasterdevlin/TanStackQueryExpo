import { Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-indigo-900 items-center justify-center p-6">
      <View className="w-full max-w-md  rounded-xl shadow-lg p-8 items-center">
        <Text className="text-2xl text-blue-500 mb-2">App.js Conf 2025 🚀</Text>
        <Text className="text-xl text-gray-400 mb-6 text-center">
          TanStack Query in Expo
        </Text>
      </View>
    </View>
  );
}
