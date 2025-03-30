import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Colors } from "@/constants/Colors";
import ReactQueryDevTools from "@/components/providers/ReactQueryDevTools";
import TanStackProvider from "@/components/providers/TanStackProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
    <TanStackProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            screenOptions={{
              headerTintColor: Colors[colorScheme].text,
              headerStyle: {
                backgroundColor: Colors[colorScheme].background,
              },
              drawerActiveTintColor: Colors[colorScheme].tint,
              drawerInactiveTintColor: Colors[colorScheme].text,
              drawerStyle: {
                backgroundColor: Colors[colorScheme].background,
              },
            }}
          >
            <Drawer.Screen
              name="index"
              options={{
                title: "Welcome",
                drawerLabel: "Home",
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="prefetching"
              options={{
                drawerLabel: "Prefetching",
                title: "movies",
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="trail-sign-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="deduping"
              options={{
                drawerLabel: "Deduping",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="cut-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="optimistic-update-cache"
              options={{
                drawerLabel: "Optimistic Update",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="flash-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="polling"
              options={{
                drawerLabel: "Polling",
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="arrow-down-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="pagination"
              options={{
                drawerLabel: "Pagination",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="book-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="infinite-scrolling"
              options={{
                drawerLabel: "Infinite Scrolling",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="infinite-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="new-todo"
              options={{ drawerItemStyle: { display: "none" } }}
            />
            <Drawer.Screen
              name="+not-found"
              options={{ drawerItemStyle: { display: "none" } }}
            />
          </Drawer>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </ThemeProvider>
      <ReactQueryDevTools />
    </TanStackProvider>
  );
}
