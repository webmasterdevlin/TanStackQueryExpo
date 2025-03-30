import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Platform } from "react-native";
import { DevToolsBubble } from "react-native-react-query-devtools";
import Clipboard from "expo-clipboard";

const ReactQueryDevTools = () => {
  // Define your copy function based on your platform
  const onCopy = async (text: string) => {
    try {
      // For Expo:
      await Clipboard.setStringAsync(text);
      // OR for React Native CLI:
      // await Clipboard.setString(text);
      return true;
    } catch {
      return false;
    }
  };

  if (Platform.OS !== "web") {
    return <DevToolsBubble onCopy={onCopy} />;
  }

  return <ReactQueryDevtools initialIsOpen={false} />;
};

export default ReactQueryDevTools;
