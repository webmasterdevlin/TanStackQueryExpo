import React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useFocusEffect } from 'expo-router';
import movieService from '@/services/movie';
import { names } from '@/state/server/queryKey';
import { Movie } from '@/models';

export default function MoviesScreen() {
  const queryClient = useQueryClient();

  const moviesQuery = useQuery<Movie[], Error>({
    queryKey: [names.movies],
    queryFn: () => movieService.getMovies(),
  });

  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      moviesQuery.refetch();
    }, [moviesQuery.refetch])
  );

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

  const renderMovieItem = ({ item: movie }: { item: Movie }) => (
    <View key={movie.id} className="mb-6 flex items-start gap-6">
      <Image
        source={{ uri: movie.imageUrl }}
        alt={movie.title}
        width={75}
        height={110}
        style={{ borderRadius: 8 }}
        resizeMode="cover"
      />
      <View className="mt-2 flex-1">
        <View className="mb-1 flex items-start justify-between">
          <Link
            href={{
              pathname: '/optimistic-update-cache/[id]',
              params: { id: movie.id },
            }}>
            <Text
              className={
                queryClient.getQueryData([names.movie, movie.id]) ? 'font-bold text-indigo-500' : ''
              }>
              {movie.title} ({movie.year})
            </Text>
          </Link>
          <TouchableOpacity onPress={() => handleDelete(movie.id)}>
            <Text className="ml-4 text-red-500">❌</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-orange-500">rating: {movie.rate}/10</Text>
        <Text className="mt-1">{movie.description}</Text>
        <Text className="mt-1">Director: {movie.director}</Text>
        <Text className="mt-1">Duration: {movie.duration}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        <Text className="mb-2 text-2xl font-bold">Watch History</Text>
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
