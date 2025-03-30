import axios from "axios";
import { Platform } from "react-native";

export const api = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://10.0.2.2:8080/"
      : "http://localhost:8080/",
});
