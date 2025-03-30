import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Platform } from "react-native";

// We only want to show DevTools on web since it's not optimized for mobile
// but it's included here for reference
const ReactQueryDevTools = () => {
  if (Platform.OS !== "web") {
    return null;
  }

  return <ReactQueryDevtools initialIsOpen={false} />;
};

export default ReactQueryDevTools;
