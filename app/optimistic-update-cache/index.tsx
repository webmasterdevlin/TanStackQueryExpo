import React, { useCallback } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Stack, useFocusEffect } from 'expo-router';
import movieService from '@/services/movie';
import { names } from '@/state/server/queryKey';
import { Movie } from '@/models';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MoviesScreen() {
  const queryClient = useQueryClient();
  const firstTimeRef = React.useRef(true);

  const moviesQuery = useQuery<Movie[], Error>({
    queryKey: [names.movies],
    queryFn: () => movieService.getMovies(),
  });

  // Refetch data when screen comes into focus (only after first render)
  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      moviesQuery.refetch();
    }, [moviesQuery.refetch])
  );

  const deleteMovieMutation = useMutation({
    mutationKey: [names.movies, 'delete'],
    mutationFn: (id: string) => movieService.deleteMovie(id),
    // Implement optimistic updates
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [names.movies] });

      // Snapshot the previous value
      const previousMovies = queryClient.getQueryData<Movie[]>([names.movies]);

      // Optimistically update by removing the movie from the list
      if (previousMovies) {
        queryClient.setQueryData<Movie[]>(
          [names.movies],
          previousMovies.filter((m) => m.id !== id)
        );

        // Also remove the individual movie query if it exists
        queryClient.removeQueries({ queryKey: [names.movie, id] });
      }

      return { previousMovies };
    },
    onError: (_error, _variables, context) => {
      // Show error notification
      console.error('Failed to delete movie');

      // Rollback the cache on error
      if (context?.previousMovies) {
        queryClient.setQueryData<Movie[]>([names.movies], context.previousMovies);
      }
    },
    onSettled: () => {
      // Invalidate queries after mutation is settled
      queryClient.invalidateQueries({ queryKey: [names.movies] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMovieMutation.mutate(id);
  };

  const renderMovieItem = ({ item: movie }: { item: Movie }) => (
    <View key={movie.id} className="mb-6 flex-row items-start gap-4 rounded-lg bg-white p-4 shadow">
      <View>
        <Image
          source={{ uri: movie.imageUrl }}
          alt={movie.title}
          className="h-[130px] w-[85px] rounded"
          resizeMode="cover"
        />
        <View className="mt-2 flex-row justify-center space-x-4">
          <Link
            href={{
              pathname: '/optimistic-update-cache/[id]',
              params: { id: movie.id },
            }}>
            <View className="items-center justify-center rounded-full bg-indigo-500 p-2">
              <Ionicons name="eye" size={18} color="white" />
            </View>
          </Link>
          <TouchableOpacity onPress={() => handleDelete(movie.id)}>
            <View className="items-center justify-center rounded-full bg-red-500 p-2">
              <Octicons name="trash" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-2 flex-1">
        <Text
          className={
            queryClient.getQueryData([names.movie, movie.id])
              ? 'font-bold text-indigo-500'
              : 'font-bold'
          }>
          {movie.title} ({movie.year})
        </Text>
        <Text className="text-orange-500">rating: {movie.rate}/10</Text>
        <Text className="mt-1">{movie.description}</Text>
        <Text className="mt-1">Director: {movie.director}</Text>
        <Text className="mt-1">Duration: {movie.duration}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'Movie Feed History',
        }}
      />
      <View className="mb-4">
        <Text className="text-lg">
          This week
          {moviesQuery.isFetching && (
            <Text className="text-gray-600"> (fetching in the background)</Text>
          )}
        </Text>
      </View>

      {moviesQuery.status === 'pending' && (
        <View className="flex flex-row items-center justify-center">
          <Text>
            Loading. Please wait. <Text className="text-orange-600">(one-time only)</Text>
          </Text>
        </View>
      )}

      {moviesQuery.status === 'error' && (
        <View className="flex flex-row items-center justify-center">
          <Text>Error: {moviesQuery.error.message}</Text>
        </View>
      )}

      {moviesQuery.status === 'success' && (
        <FlatList
          data={moviesQuery.data}
          renderItem={renderMovieItem}
          keyExtractor={(movie) => movie.id.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      {deleteMovieMutation.isPending && (
        <View className="flex items-center justify-center">
          <ActivityIndicator size="small" color="#f97316" />
          <Text className="ml-2">Deleting...</Text>
        </View>
      )}
    </View>
  );
}
