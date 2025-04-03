import {
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  withTiming,
  Easing,
  interpolateColor,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';

export default function HomeScreen() {
  const { height, width } = useWindowDimensions();
  const [pulseActive, setPulseActive] = useState(true);

  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const pulseValue = useSharedValue(1);
  const colorProgress = useSharedValue(0);
  const orbitRadius = useSharedValue(0);
  const orbitAngle = useSharedValue(0);

  // Derived values for color animation
  const animatedColor = useDerivedValue(() => {
    return interpolateColor(
      colorProgress.value,
      [0, 0.2, 0.4, 0.6, 0.8, 1],
      ['#4f46e5', '#3b82f6', '#06b6d4', '#0ea5e9', '#8b5cf6', '#4f46e5']
    );
  });

  // Orbit animation for the floating elements
  const orbitX = useDerivedValue(() => {
    return Math.cos(orbitAngle.value) * orbitRadius.value;
  });

  const orbitY = useDerivedValue(() => {
    return Math.sin(orbitAngle.value) * orbitRadius.value;
  });

  // Animation styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value * 360}deg` }, { scale: scale.value }],
    };
  });

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
      opacity: 2 - pulseValue.value, // Fade out as it grows
    };
  });

  const colorAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animatedColor.value,
    };
  });

  const orbitAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: orbitX.value }, { translateY: orbitY.value }],
    };
  });

  const floatingElementStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Start animations
  useEffect(() => {
    // Floating animation
    translateY.value = withRepeat(
      withSequence(withTiming(-10, { duration: 1000 }), withTiming(10, { duration: 1000 })),
      -1, // Infinite
      true // Reverse
    );

    // Rotation animation
    rotation.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.linear }), -1);

    // Color cycle animation
    colorProgress.value = withRepeat(withTiming(1, { duration: 3000 }), -1);

    // Orbit animation
    orbitRadius.value = withTiming(80, { duration: 1000 });
    orbitAngle.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1
    );

    // Start pulse animation
    startPulseAnimation();

    return () => {
      setPulseActive(false);
    };
  }, []);

  // Pulse animation function
  const startPulseAnimation = () => {
    if (!pulseActive) return;

    pulseValue.value = 1;
    pulseValue.value = withDelay(
      500,
      withTiming(
        1.8,
        {
          duration: 1500,
          easing: Easing.out(Easing.ease),
        },
        (finished) => {
          if (finished) {
            runOnJS(startPulseAnimation)();
          }
        }
      )
    );
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient
        colors={['#e0f2fe', '#bfdbfe', '#93c5fd']}
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
              <View className="h-24 w-24 rounded-full bg-blue-300/40 blur-sm" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).springify()}
              className="absolute left-8 top-32">
              <View className="h-16 w-16 rounded-full bg-indigo-300/40 blur-sm" />
            </Animated.View>

            {/* Main card */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={floatingElementStyle}
              className="w-full max-w-md items-center overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 shadow-xl backdrop-blur-md">
              <View className="mb-6 items-center">
                <Animated.View style={logoAnimatedStyle}>
                  <Image
                    source={require('../assets/images/react-logo.png')}
                    className="mb-6 h-20 w-20"
                    resizeMode="contain"
                  />
                </Animated.View>
                <Text className="mb-2 text-4xl font-bold text-indigo-800">App.js Conf</Text>
                <View className="flex-row items-center">
                  <Text className="text-xl text-indigo-700">TanStack Query in Expo demo</Text>
                </View>
              </View>

              <View className="my-6 h-0.5 w-full bg-indigo-200" />

              <View className="w-full space-y-4">
                <Animated.View
                  entering={FadeInDown.delay(500).springify()}
                  className="flex-row items-center">
                  <Text className="ml-3 text-xl text-indigo-700">By: @DevlinDuldulao</Text>
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(600).springify()}
                  className="flex-row items-center">
                  <Text className="ml-3 text-lg text-indigo-700">Crayon Consulting</Text>
                </Animated.View>
              </View>

              {/* Animated footer with pulsing effect */}
              <View className="mt-8 w-full items-center">
                <Animated.View
                  className="h-16 w-16 items-center justify-center overflow-visible rounded-full"
                  style={colorAnimatedStyle}>
                  <Animated.View
                    className="absolute h-16 w-16 rounded-full bg-indigo-500/60 blur-sm"
                    style={pulseAnimatedStyle}
                  />
                  <Text className="text-xl text-white">2025</Text>
                </Animated.View>
              </View>
            </Animated.View>

            {/* Orbiting elements */}
            <Animated.View style={orbitAnimatedStyle} className="absolute z-10">
              <Animated.View
                style={colorAnimatedStyle}
                className="h-8 w-8 items-center justify-center rounded-full">
                <Ionicons name="rocket" size={18} color="white" />
              </Animated.View>
            </Animated.View>

            {/* Bottom decoration */}
            <Animated.View
              entering={FadeInUp.delay(500).springify()}
              className="absolute bottom-20 left-10">
              <View className="h-32 w-32 rounded-full bg-purple-300/30 blur-sm" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(600).springify()}
              className="absolute bottom-32 right-0">
              <View className="h-24 w-24 rounded-full bg-cyan-300/30 blur-md" />
            </Animated.View>

            {/* Swipe indicator text */}
            <Animated.View style={floatingElementStyle} className="absolute bottom-10">
              <Text className="text-indigo-700 opacity-80">Swipe right to explore demos →</Text>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
