import axios from "axios";
import { delay } from "@/utilities/api";
import { slow } from "./config";

const dedupeService = {
  getPosts: async () => {
    await delay(slow);
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts`
    );
    return response.data;
  },

  getUsers: async () => {
    await delay(slow);
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/users`
    );
    return response.data;
  },
};

export default dedupeService;
