import { useColorScheme as useNativeColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

export function useColorScheme(): ColorScheme {
  const colorScheme = useNativeColorScheme();
  // Return light as the default if colorScheme is null or undefined
  return colorScheme || "light";
}
