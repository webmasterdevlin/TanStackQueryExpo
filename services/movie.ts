import axios from "axios";
import { Movie } from "../models";
import { delay } from "@/utilities/api";
import { slow } from "./config";

export class MovieService {
  private baseUrl = "http://localhost:8080";

  getMovieById = async (id: number): Promise<Movie> => {
    await delay(slow);
    const response = await axios.get<Movie>(`${this.baseUrl}/movies/${id}`);
    return response.data;
  };

  getMovies = async (): Promise<Array<Movie>> => {
    await delay(slow);
    const response = await axios.get<Array<Movie>>(`${this.baseUrl}/movies`);
    return response.data;
  };

  deleteMovie = async (id: number): Promise<void> => {
    await delay(slow);
    await axios.delete(`${this.baseUrl}/movies/${id}`);
  };
}

// Create a singleton instance
const movieService = new MovieService();
export default movieService;
