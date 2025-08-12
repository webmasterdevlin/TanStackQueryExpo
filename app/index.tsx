import {
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerActions, useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();

  // Fix the dark overlay issue by resetting drawer state on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.dispatch(DrawerActions.closeDrawer());
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
  const triangleRotation = useSharedValue(0);

  // Prada color animation (black to subtle red accent)
  const animatedColor = useDerivedValue(() => {
    return interpolateColor(
      colorProgress.value,
      [0, 0.25, 0.5, 0.75, 1],
      ['#000000', '#1a1a1a', '#8B0000', '#1a1a1a', '#000000']
    );
  });

  // Orbit animation
  const orbitX = useDerivedValue(() => {
    return Math.cos(orbitAngle.value) * orbitRadius.value;
  });

  const orbitY = useDerivedValue(() => {
    return Math.sin(orbitAngle.value) * orbitRadius.value * 0.5;
  });

  // Animation styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value * 360}deg` }, { scale: scale.value }],
    };
  });

  const triangleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${triangleRotation.value}deg` }],
    };
  });

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
      opacity: 0.3 * (2 - pulseValue.value),
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
    // Subtle floating
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Slow rotation
    rotation.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.linear }),
      -1
    );

    // Triangle rotation
    triangleRotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1
    );

    // Color cycle
    colorProgress.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1
    );

    // Orbit animation
    orbitRadius.value = withTiming(100, { duration: 1500, easing: Easing.out(Easing.ease) });
    orbitAngle.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1
    );

    startPulseAnimation();

    return () => {
      setPulseActive(false);
    };
  }, []);

  // Pulse animation
  const startPulseAnimation = () => {
    if (!pulseActive) return;

    pulseValue.value = 1;
    pulseValue.value = withDelay(
      1000,
      withTiming(
        1.3,
        {
          duration: 2000,
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

  // Prada triangle component
  const PradaTriangle = ({ size = 'normal' }: { size?: 'small' | 'normal' | 'large' }) => {
    const dimensions = {
      small: { left: 8, right: 8, bottom: 14 },
      normal: { left: 12, right: 12, bottom: 20 },
      large: { left: 16, right: 16, bottom: 28 }
    };
    const dim = dimensions[size];
    return (
      <View className="items-center justify-center">
        <View style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: dim.left,
          borderRightWidth: dim.right,
          borderBottomWidth: dim.bottom,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#000000'
        }} />
      </View>
    );
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient
        colors={['#ffffff', '#f5f5f5', '#e8e8e8']} // Using Prada colors
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: height,
          zIndex: -1,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      />
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1"
          showsVerticalScrollIndicator={false}>
          <View className="min-h-full flex-1 items-center justify-center px-6 py-10">

            {/* Geometric decorations */}
            <Animated.View
              entering={FadeInUp.delay(300).springify()}
              style={triangleAnimatedStyle}
              className="absolute right-8 top-20">
              <View className="h-1 w-20 bg-prada-black" />
              <View className="mt-2 h-1 w-14 bg-prada-black" />
              <View className="mt-2 h-1 w-8 bg-prada-black" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).springify()}
              className="absolute left-10 top-36">
              <PradaTriangle size="small" />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(350).springify()}
              className="absolute right-16 top-48 opacity-20">
              <PradaTriangle size="large" />
            </Animated.View>

            {/* Main card */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={floatingElementStyle}
              className="w-full max-w-md items-center overflow-hidden rounded-sm border border-pradaApp-borderSubtle bg-pradaApp-bgPrimary/95 p-10 shadow-luxury-2xl">

              {/* Header accent line */}
              <View className="absolute left-0 top-0 h-1 w-full bg-prada-black" />

              <View className="mb-8 items-center">
                <Animated.View style={logoAnimatedStyle}>
                  <Image
                    source={require('../assets/images/react-logo.png')}
                    className="mb-8 h-16 w-16"
                    resizeMode="contain"
                    style={{ tintColor: '#000000' }}
                  />
                </Animated.View>

                {/* Typography with Prada luxury styling */}
                <Text className="mb-1 text-luxury-xs font-light tracking-luxuryWide text-pradaApp-textMuted uppercase">
                  WELCOME TO
                </Text>
                <Text className="mb-3 text-luxury-3xl font-light tracking-wider text-prada-black">
                  CODEMOTION
                </Text>
                <Text className="mb-1 text-luxury-4xl font-bold tracking-luxury text-prada-black">
                  MILAN
                </Text>
                <Text className="mt-2 text-luxury-xs font-light tracking-luxuryWidest text-pradaApp-textLight uppercase">
                  2025
                </Text>

                {/* Divider */}
                <View className="my-6 h-hairline w-32 bg-pradaApp-borderSubtle" />

                <Text className="text-luxury-sm font-light tracking-wider text-pradaApp-textSecondary uppercase">
                  TANSTACK QUERY
                </Text>
                <Text className="mt-1 text-luxury-xs font-light tracking-luxury text-pradaApp-textMuted uppercase">
                  EXPO DEMONSTRATION
                </Text>
              </View>

              {/* Separator */}
              <View className="my-8 flex-row items-center justify-center">
                <View className="h-hairline w-8 bg-pradaApp-borderSubtle" />
                <View className="mx-3 h-1 w-1 rounded-full bg-pradaApp-borderLight" />
                <View className="h-hairline w-8 bg-pradaApp-borderSubtle" />
              </View>

              {/* Credits */}
              <View className="w-full items-center space-y-3">
                <Animated.View entering={FadeInDown.delay(500).springify()}>
                  <Text className="text-luxury-xs font-light tracking-luxury text-pradaApp-textMuted uppercase">
                    PRESENTED BY
                  </Text>
                  <Text className="mt-2 text-luxury-base font-normal tracking-wider text-prada-black">
                    @DevlinDuldulao
                  </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(600).springify()} className="mt-4">
                  <Text className="text-luxury-xs font-light tracking-luxury text-pradaApp-textLight uppercase">
                    CRAYON CONSULTING
                  </Text>
                </Animated.View>
              </View>

              {/* Animated accent */}
              <View className="mt-10 w-full items-center">
                <Animated.View
                  className="h-12 w-12 items-center justify-center overflow-visible"
                  style={colorAnimatedStyle}>
                  <Animated.View
                    className="absolute h-12 w-12 bg-prada-black/20"
                    style={pulseAnimatedStyle}
                  />
                  <PradaTriangle />
                </Animated.View>
              </View>

              {/* Bottom accent line */}
              <View className="absolute bottom-0 left-0 h-1 w-full bg-prada-black" />
            </Animated.View>

            {/* Orbiting element */}
            <Animated.View style={orbitAnimatedStyle} className="absolute z-10">
              <Animated.View
                style={[colorAnimatedStyle, triangleAnimatedStyle]}
                className="items-center justify-center">
                <View style={{
                  width: 0,
                  height: 0,
                  backgroundColor: 'transparent',
                  borderStyle: 'solid',
                  borderLeftWidth: 8,
                  borderRightWidth: 8,
                  borderBottomWidth: 14,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: '#000000'
                }} />
              </Animated.View>
            </Animated.View>

            {/* Bottom geometric decorations */}
            <Animated.View
              entering={FadeInUp.delay(500).springify()}
              className="absolute bottom-24 left-12">
              <View className="h-16 w-hairline bg-pradaApp-borderLight" />
              <View className="absolute -left-2 top-0 h-hairline w-5 bg-pradaApp-borderLight" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(600).springify()}
              className="absolute bottom-36 right-8">
              <View className="flex-row space-x-1">
                <View className="h-2 w-2 bg-prada-darkGray/20" />
                <View className="h-2 w-2 bg-prada-gray/10" />
                <View className="h-2 w-2 bg-prada-lightGray/5" />
              </View>
            </Animated.View>

            {/* Swipe indicator */}
            <Animated.View style={floatingElementStyle} className="absolute bottom-10">
              <TouchableOpacity
                onPress={() => {
                  navigation.dispatch(DrawerActions.openDrawer());
                }}
                className="flex-row items-center px-4 py-2">
                <Text className="text-luxury-xs font-light tracking-luxury text-pradaApp-textMuted uppercase">
                  SWIPE TO EXPLORE
                </Text>
                <Text className="ml-2 text-pradaApp-textLight">→</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}