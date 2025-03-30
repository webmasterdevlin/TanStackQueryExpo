import { Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  return (
    <View className="flex-1 bg-indigo-900 items-center justify-center p-6">
      <StatusBar style="light" />
      <View className="w-full max-w-md  rounded-xl shadow-lg p-8 items-center">
        <Text className="text-xl text-blue-600 mb-2">App.js Conf</Text>
        <Text className="text-lg text-gray-600 mb-6 text-center">
          TanStack Query in Expo 👋
        </Text>
      </View>
    </View>
  );
}
