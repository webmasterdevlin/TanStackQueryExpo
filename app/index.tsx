import {
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
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
  const { height } = useWindowDimensions();
  const [pulseActive, setPulseActive] = useState(true);
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  // Fix the dark overlay issue by resetting drawer state on mount
  useEffect(() => {
    // Small delay to ensure the drawer state is properly reset
    const timer = setTimeout(() => {
      navigation.closeDrawer();
    }, 100);

    return () => clearTimeout(timer);
  }, [navigation]);

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
      ['#484dfc', '#7189ff', '#a0b9ff', '#ccd8ff', '#484dfc', '#484dfc']
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
        colors={['#eef0ff', '#f7eded', '#faf8f8']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: height,
          zIndex: -1, // Ensure gradient stays behind content
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
              <View className="bg-appBlue-40/40 h-24 w-24 rounded-full blur-sm" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).springify()}
              className="absolute left-8 top-32">
              <View className="bg-appBlue-60/40 h-16 w-16 rounded-full blur-sm" />
            </Animated.View>

            {/* Main card */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={floatingElementStyle}
              className="bg-appAccent-0/60 w-full max-w-md items-center overflow-hidden rounded-3xl border border-white/60 p-8 shadow-xl backdrop-blur-md">
              <View className="mb-6 items-center">
                <Animated.View style={logoAnimatedStyle}>
                  <Image
                    source={require('../assets/images/react-logo.png')}
                    className="mb-6 h-20 w-20"
                    resizeMode="contain"
                  />
                </Animated.View>
                <Text className="text-appBlack-100 mb-2 text-4xl font-bold">App.js Conf</Text>
                <View className="flex-row items-center">
                  <Text className="text-appBlack-80 text-xl">TanStack Query in Expo demo</Text>
                </View>
              </View>

              <View className="bg-appBlue-40 my-6 h-0.5 w-full" />

              <View className="w-full space-y-4">
                <Animated.View
                  entering={FadeInDown.delay(500).springify()}
                  className="flex-row items-center">
                  <Text className="text-appBlue-100 ml-3 text-xl">By: @DevlinDuldulao</Text>
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(600).springify()}
                  className="flex-row items-center">
                  <Text className="text-appBlack-80 ml-3 text-lg">Crayon Consulting</Text>
                </Animated.View>
              </View>

              {/* Animated footer with pulsing effect */}
              <View className="mt-8 w-full items-center">
                <Animated.View
                  className="h-16 w-16 items-center justify-center overflow-visible rounded-full"
                  style={colorAnimatedStyle}>
                  <Animated.View
                    className="bg-appBlue-80/60 absolute h-16 w-16 rounded-full blur-sm"
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
              <View className="bg-appAccent-100/30 h-32 w-32 rounded-full blur-sm" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(600).springify()}
              className="absolute bottom-32 right-0">
              <View className="bg-appBlue-40/30 h-24 w-24 rounded-full blur-md" />
            </Animated.View>

            {/* Swipe indicator text */}
            <Animated.View style={floatingElementStyle} className="absolute bottom-10">
              <Text className="text-appBlue-100 opacity-80">Swipe right to explore demos →</Text>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
