import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import movieService from "@/services/movie";
import { names } from "@/state/server/queryKey";
import { Movie } from "@/models";

export default function MovieScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const movieId = parseInt(id || "0");

  const goBack = () => {
    router.back();
  };

  const setMovieId = (id: number) => {
    if (id === -1) {
      goBack();
    } else {
      router.push(`/optimistic-update-cache/${id}`);
    }
  };

  const movieQuery = useQuery<Movie, Error>({
    queryKey: [names.movie, movieId],
    queryFn: () => movieService.getMovieById(movieId),
    enabled: movieId > 0,
  });

  if (movieQuery.status === "pending") {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text>
          Loading. Please wait.{" "}
          <Text className="text-orange-300">(one-time only)</Text>
        </Text>
      </View>
    );
  }

  if (movieQuery.status === "error") {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text>Error: {movieQuery.error.message}</Text>
      </View>
    );
  }

  const movie = movieQuery.data;

  if (!movie) {
    return null;
  }

  return (
    <View className="flex-1 p-4">
      <View>
        <TouchableOpacity onPress={() => setMovieId(-1)}>
          <Text className="text-xl font-bold mb-4">🔙</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-start gap-6">
        <Image
          source={{ uri: movie.imageUrl }}
          className="w-[200px] h-[300px]"
          alt={movie.title}
        />
        <View className="flex-col flex-wrap justify-start flex-1">
          <View className="flex-wrap gap-10">
            <TouchableOpacity onPress={() => setMovieId(movie.id)}>
              <Text className="text-lg font-bold">
                {movie.title} ({movie.year})
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text className="text-orange-500">rating: {movie.rate}/10</Text>
          </View>
          <View>
            <Text>{movie.description}</Text>
          </View>
          <View>
            <Text>Director: {movie.director}</Text>
          </View>
          <View>
            <Text>Duration: {movie.duration}</Text>
          </View>
        </View>
      </View>

      <View className="flex items-center justify-center mt-4">
        {movieQuery.isFetching && (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#f97316" />
            <Text className="ml-2">Fetching in the background</Text>
          </View>
        )}
      </View>
    </View>
  );
}
