import { api } from '@/http-client/api-config';
import { Movie } from '@/models';

const endPoint = 'movies';

const movieService = {
  async getMovieById(id: string): Promise<Movie> {
    const response = await api.get<Movie>(`${endPoint}/${id}`);
    return response.data;
  },

  async getMovies(): Promise<Array<Movie>> {
    const response = await api.get<Array<Movie>>(endPoint);
    return response.data;
  },

  async deleteMovie(id: string): Promise<void> {
    await api.delete(`${endPoint}/${id}`);
  },
};

export default movieService;
