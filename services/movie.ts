import axios from "axios";
import { Movie } from "../models";
import { api } from "@/http-client/api-config";

const endPoint = "movies";

const movieService = {
  async getMovieById(id: number): Promise<Movie> {
    const response = await api.get<Movie>(`${endPoint}/${id}`);
    return response.data;
  },

  async getMovies(): Promise<Array<Movie>> {
    const response = await api.get<Array<Movie>>(endPoint);
    return response.data;
  },

  async deleteMovie(id: number): Promise<void> {
    await api.delete(`${endPoint}/${id}`);
  },
};

export default movieService;
