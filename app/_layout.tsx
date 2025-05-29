import '../global.css';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReactQueryDevTools from '@/components/providers/ReactQueryDevTools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSyncQueriesExternal } from 'react-query-external-sync';
import { Platform } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 3 total attempts (1 initial + 2 retries)
      retry: 2,
      // 0s -> 1s, 1s → 5s
      retryDelay: attemptIndex => Math.min(1000 * 5 ** attemptIndex, 10000),
    }
  }
});

const appjsConfColors = {
  primaryBlue100: '#484dfc',
  primaryBlue80: '#7189ff',
  primaryBlue20: '#eef0ff',
  appBlack100: '#261930',
  appBlack60: '#877b91',
  appAccent0: '#faf8f8',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  // Set up the sync hook - automatically disabled in production!
  useSyncQueriesExternal({
    queryClient,
    socketURL: 'http://localhost:42831', // Default port for React Native DevTools
    deviceName: Platform?.OS || 'web', // Platform detection
    platform: Platform?.OS || 'web', // Use appropriate platform identifier
    deviceId: Platform?.OS || 'web', // Use a PERSISTENT identifier (see note below)
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: '1.0.0',
      // Add any relevant platform info
    },
    enableLogs: false,
  });

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            screenOptions={{
              headerTintColor: appjsConfColors.appBlack100,
              headerStyle: {
                backgroundColor: appjsConfColors.appAccent0,
              },
              drawerActiveTintColor: appjsConfColors.primaryBlue100,
              drawerInactiveTintColor: appjsConfColors.appBlack60,
              drawerStyle: {
                backgroundColor: appjsConfColors.primaryBlue20,
                borderRightColor: appjsConfColors.primaryBlue80,
                borderRightWidth: 1,
              },
              // Set a transparent overlay color to prevent dark overlay on startup
              overlayColor: 'transparent',
            }}
            // Set default state to closed to avoid overlay issues
            initialRouteName="index"
            defaultStatus="closed">
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: 'Home',
                headerShown: false,
                drawerIcon: ({ size, color }) => <Ionicons name="home" size={size} color={color} />,
              }}
            />
            <Drawer.Screen
              name="prefetching"
              options={{
                drawerLabel: 'Prefetching',
                title: 'Prefetching',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="trail-sign-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="deduping"
              options={{
                drawerLabel: 'Deduping',
                title: 'Deduping',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="cut-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="optimistic-update-cache"
              options={{
                drawerLabel: 'Optimistic Update',
                title: 'Optimistic Update',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="flash-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="polling"
              options={{
                drawerLabel: 'Polling',
                title: 'Polling',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="arrow-down-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="pagination"
              options={{
                drawerLabel: 'Pagination',
                title: 'Pagination',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="book-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="infinite-scrolling"
              options={{
                drawerLabel: 'Infinite Scrolling',
                title: 'Infinite Scrolling',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="infinite-outline" size={size} color={color} />
                ),
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </ThemeProvider>
      <ReactQueryDevTools />
    </QueryClientProvider>
  );
}
