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
import { useReactQueryDevTools } from '@dev-plugins/react-query';

const queryClient = new QueryClient();

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
  useReactQueryDevTools(queryClient);

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
