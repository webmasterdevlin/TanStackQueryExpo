import { api } from "@/http-client/api-config";
import axios from "axios";

const dedupeService = {
  getPosts: async () => {
    const response = await api.get("posts");
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get("users");
    return response.data;
  },
};

export default dedupeService;
