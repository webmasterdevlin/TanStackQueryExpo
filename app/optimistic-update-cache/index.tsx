import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import movieService from "@/services/movie";
import { names } from "@/state/server/queryKey";
import { Movie } from "@/models";

export default function MoviesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const setMovieId = (id: number) => {
    router.push(`/optimistic-update-cache/${id}`);
  };

  const moviesQuery = useQuery<Movie[], Error>({
    queryKey: [names.movies],
    queryFn: () => movieService.getMovies(),
  });

  const deleteMovieMutation = useMutation({
    mutationFn: (id: number) => movieService.deleteMovie(id),
    onMutate: async (id: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [names.movies] });

      // Snapshot the previous value
      const backup = queryClient.getQueryData<Movie[]>([names.movies]);

      // Optimistically update by removing the movie from the list
      if (backup) {
        queryClient.setQueryData<Movie[]>(
          [names.movies],
          backup.filter((m) => m.id !== id)
        );
        return { backup };
      }
      return { backup: null };
    },
    onError: (_error, _variables, context) => {
      // Rollback the cache on error
      if (context?.backup) {
        queryClient.setQueryData<Movie[]>([names.movies], context.backup);
      }
    },
    onSettled: () => {
      // Invalidate queries after mutation is settled
      queryClient.invalidateQueries({ queryKey: [names.movies] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMovieMutation.mutate(id);
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-2">Watch History</Text>
      <Text className="text-lg mb-4">
        This week
        {moviesQuery.isFetching && (
          <Text className="text-gray-500"> (fetching in the background)</Text>
        )}
      </Text>

      <View className="flex items-center justify-center">
        {moviesQuery.status === "pending" && (
          <Text>
            Loading. Please wait.{" "}
            <Text className="text-orange-300">(one-time only)</Text>
          </Text>
        )}

        {moviesQuery.status === "error" && (
          <Text>Error: {moviesQuery.error.message}</Text>
        )}

        {moviesQuery.status === "success" && (
          <View className="w-full mb-4">
            {moviesQuery.data.map((movie) => (
              <View key={movie.id} className="flex-row items-start gap-6 mb-6">
                <Image
                  source={{ uri: movie.imageUrl }}
                  className="w-[150px] h-[225px]"
                  alt={movie.title}
                />
                <View className="flex-1 mt-2">
                  <View className="flex-row justify-between items-start mb-1">
                    <TouchableOpacity onPress={() => setMovieId(movie.id)}>
                      <Text
                        className={
                          queryClient.getQueryData([names.movie, movie.id])
                            ? "font-bold text-indigo-500"
                            : ""
                        }
                      >
                        {movie.title} ({movie.year})
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(movie.id)}>
                      <Text className="text-red-500 ml-4">❌</Text>
                    </TouchableOpacity>
                  </View>
                  <Text className="text-orange-500">
                    rating: {movie.rate}/10
                  </Text>
                  <Text className="mt-1">{movie.description}</Text>
                  <Text className="mt-1">Director: {movie.director}</Text>
                  <Text className="mt-1">Duration: {movie.duration}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {deleteMovieMutation.isPending && (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#f97316" />
            <Text className="ml-2">Deleting...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
