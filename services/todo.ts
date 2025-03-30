import axios from "axios";
import { Todo } from "../models";
import { delay } from "@/utilities/api";

const API_URL = "http://localhost:8080/todo-list";

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    await delay(2000);
    const response = await axios.get<Todo[]>(API_URL);
    return response.data;
  },

  async postTodo(title: string): Promise<Todo> {
    await delay(2000);
    const response = await axios.post<Todo>(API_URL, {
      title,
      completed: false,
    });
    return response.data;
  },
};
