import '../global.css';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReactQueryDevTools from '@/components/providers/ReactQueryDevTools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSyncQueriesExternal } from 'react-query-external-sync';
import { Platform, View } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 3 total attempts (1 initial + 2 retries)
      retry: 2,
      // 0s -> 1s, 1s → 5s. Little resiliency 😁
      retryDelay: attemptIndex => Math.min(1000 * 5 ** attemptIndex, 10000),
    }
  }
});

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

  // Custom drawer icon components using Prada minimal design
  const PradaTriangleIcon = ({ color }: { color: string }) => (
    <View style={{
      width: 24,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <View style={{
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 18,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color
      }} />
    </View>
  );

  const MinimalLineIcon = ({ color, pattern }: { color: string, pattern: 'bars' | 'split' | 'arrow' | 'dots' | 'circle' | 'lightning' }) => {
    const containerStyle = {
      width: 24,
      height: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const
    };

    switch (pattern) {
      case 'bars':
        return (
          <View style={containerStyle}>
            <View style={{ width: 2, height: 8, backgroundColor: color }} />
            <View style={{ width: 10, height: 2, backgroundColor: color, marginVertical: 2 }} />
            <View style={{ width: 2, height: 8, backgroundColor: color }} />
          </View>
        );
      case 'split':
        return (
          <View style={containerStyle}>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <View style={{ width: 8, height: 2, backgroundColor: color }} />
              <View style={{ width: 8, height: 2, backgroundColor: color }} />
            </View>
            <View style={{ width: 16, height: 2, backgroundColor: color, marginTop: 4 }} />
          </View>
        );
      case 'arrow':
        return (
          <View style={containerStyle}>
            <View style={{ width: 2, height: 12, backgroundColor: color, position: 'absolute' }} />
            <View style={{
              position: 'absolute',
              bottom: 2,
              width: 0,
              height: 0,
              borderLeftWidth: 4,
              borderRightWidth: 4,
              borderTopWidth: 6,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: color
            }} />
          </View>
        );
      case 'dots':
        return (
          <View style={[containerStyle, { flexDirection: 'row', gap: 3 }]}>
            <View style={{ width: 4, height: 4, backgroundColor: color }} />
            <View style={{ width: 4, height: 4, backgroundColor: color }} />
            <View style={{ width: 4, height: 4, backgroundColor: color }} />
          </View>
        );
      case 'circle':
        return (
          <View style={containerStyle}>
            <View style={{
              width: 16,
              height: 16,
              borderWidth: 2,
              borderColor: color,
              borderRadius: 8,
              borderStyle: 'dashed'
            }} />
          </View>
        );
      case 'lightning':
        return (
          <View style={containerStyle}>
            <View style={{
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderLeftWidth: 3,
              borderRightWidth: 3,
              borderBottomWidth: 10,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
              transform: [{ rotate: '45deg' }]
            }} />
            <View style={{
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderLeftWidth: 3,
              borderRightWidth: 3,
              borderBottomWidth: 10,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
              transform: [{ rotate: '-135deg' }],
              position: 'absolute',
              top: 8
            }} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            screenOptions={{
              // Header styling with Prada design tokens
              headerTintColor: '#000000', // prada.black
              headerStyle: {
                backgroundColor: '#ffffff', // prada.white
                borderBottomWidth: 0.5,
                borderBottomColor: '#e8e8e8', // prada.paleGray
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                fontWeight: '300',
                letterSpacing: 2,
                fontSize: 16,
                textTransform: 'uppercase',
              },

              // Drawer styling with Prada luxury aesthetic
              drawerActiveTintColor: '#000000', // prada.black
              drawerInactiveTintColor: '#4a4a4a', // Darker gray for better readability
              drawerActiveBackgroundColor: '#f0f0f0',
              drawerInactiveBackgroundColor: 'transparent',
              drawerStyle: {
                backgroundColor: '#fafafa', // pradaApp.bgElevated
                borderRightColor: '#d0d0d0', // pradaApp.borderLight
                borderRightWidth: 0.5,
                width: 280,
              },
              drawerLabelStyle: {
                fontWeight: '300',
                letterSpacing: 1.5,
                fontSize: 13,
                marginLeft: 12, // Proper spacing from icon
                textTransform: 'uppercase',
              },
              drawerItemStyle: {
                marginVertical: 4,
                marginHorizontal: 12,
                borderRadius: 0,
                paddingVertical: 8,
                paddingHorizontal: 16,
              },
              drawerContentStyle: {
                paddingTop: 20,
              },

              // Overlay and interaction
              overlayColor: 'rgba(0, 0, 0, 0.2)',
              swipeEdgeWidth: 60,
              swipeMinDistance: 25,
            }}
            initialRouteName="index"
            defaultStatus="closed">

            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: 'HOME',
                headerShown: false,
                drawerIcon: ({ color }) => <PradaTriangleIcon color={color} />,
              }}
            />

            <Drawer.Screen
              name="prefetching"
              options={{
                drawerLabel: 'PREFETCHING',
                title: 'PREFETCHING',
                drawerIcon: ({ color }) => <MinimalLineIcon color={color} pattern="bars" />,
              }}
            />

            <Drawer.Screen
              name="deduping"
              options={{
                drawerLabel: 'DEDUPING',
                title: 'DEDUPING',
                drawerIcon: ({ color }) => <MinimalLineIcon color={color} pattern="split" />,
              }}
            />

            <Drawer.Screen
              name="polling"
              options={{
                drawerLabel: 'POLLING',
                title: 'POLLING',
                drawerIcon: ({ color }) => <MinimalLineIcon color={color} pattern="arrow" />,
              }}
            />

            <Drawer.Screen
              name="pagination"
              options={{
                drawerLabel: 'PAGINATION',
                title: 'PAGINATION',
                drawerIcon: ({ color }) => <MinimalLineIcon color={color} pattern="dots" />,
              }}
            />

            <Drawer.Screen
              name="infinite-scrolling"
              options={{
                drawerLabel: 'INFINITE SCROLL',
                title: 'INFINITE SCROLL',
                drawerIcon: ({ color }) => <MinimalLineIcon color={color} pattern="circle" />,
              }}
            />

            <Drawer.Screen
              name="optimistic-update-cache"
              options={{
                drawerLabel: 'OPTIMISTIC UPDATE',
                title: 'OPTIMISTIC UPDATE',
                drawerIcon: ({ color }) => <MinimalLineIcon color={color} pattern="lightning" />,
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