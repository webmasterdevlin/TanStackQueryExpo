import axios from "axios";

const dedupeService = {
  getPosts: async () => {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts`
    );
    return response.data;
  },

  getUsers: async () => {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/users`
    );
    return response.data;
  },
};

export default dedupeService;
