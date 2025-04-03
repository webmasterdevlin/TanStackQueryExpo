import {
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function HomeScreen() {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  const { height, width } = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    setIsPressed(true);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    setIsPressed(false);
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#1e1b4b', '#312e81', '#4338ca']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: height,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1"
          showsVerticalScrollIndicator={false}>
          <View className="min-h-full flex-1 items-center justify-center px-6 py-10">
            {/* Top decoration */}
            <Animated.View
              entering={FadeInUp.delay(300).springify()}
              className="absolute right-5 top-16">
              <View className="h-24 w-24 rounded-full bg-indigo-500/20 blur-sm" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).springify()}
              className="absolute left-8 top-32">
              <View className="h-16 w-16 rounded-full bg-blue-400/20 blur-sm" />
            </Animated.View>

            {/* Main card */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={animatedStyle}
              className="w-full max-w-md items-center overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
              <View className="mb-6 items-center">
                <Image
                  source={require('../assets/images/react-logo.png')}
                  className="mb-6 h-20 w-20"
                  resizeMode="contain"
                />
                <Text className="mb-2 text-4xl font-bold text-white">
                  App.js Conf <Text className="text-yellow-400">2025</Text>
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-xl text-blue-200">TanStack Query in Expo</Text>
                  <Text className="ml-2 text-2xl">🚀</Text>
                </View>
              </View>

              <View className="my-6 h-0.5 w-full bg-white/10" />

              <View className="w-full space-y-4">
                <Animated.View
                  entering={FadeInDown.delay(500).springify()}
                  className="flex-row items-center">
                  <Ionicons name="flash" size={24} color="#93c5fd" />
                  <Text className="ml-3 text-blue-200">High-performance data fetching</Text>
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(600).springify()}
                  className="flex-row items-center">
                  <Ionicons name="sync" size={24} color="#93c5fd" />
                  <Text className="ml-3 text-blue-200">Automatic caching & background updates</Text>
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(700).springify()}
                  className="flex-row items-center">
                  <Ionicons name="code-slash" size={24} color="#93c5fd" />
                  <Text className="ml-3 text-blue-200">Type-safe with TypeScript</Text>
                </Animated.View>
              </View>

              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className={`mt-8 w-full rounded-xl px-6 py-4 ${isPressed ? 'bg-blue-700' : 'bg-blue-600'}`}>
                <Text className="text-center text-lg font-bold text-white">Explore Demos</Text>
              </Pressable>
            </Animated.View>

            {/* Bottom decoration */}
            <Animated.View
              entering={FadeInUp.delay(500).springify()}
              className="absolute bottom-20 left-10">
              <View className="h-32 w-32 rounded-full bg-purple-500/20 blur-sm" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(600).springify()}
              className="absolute bottom-32 right-0">
              <View className="h-24 w-24 rounded-full bg-cyan-400/20 blur-md" />
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
