import { View, Text } from 'react-native';

export default function Spinner() {
  return (
    <View className="inline-flex animate-spin pl-3 pr-3 opacity-100 transition-all delay-300 duration-500">
      <Text>🌀</Text>
    </View>
  );
}
