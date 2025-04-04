import { api } from '@/http-client/api-config';
import { Post, User } from '@/models';

const dedupeService = {
  async getPosts(): Promise<Post[]> {
    const response = await api.get<Post[]>('posts');
    return response.data;
  },

  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('users');
    return response.data;
  },
};

export default dedupeService;
