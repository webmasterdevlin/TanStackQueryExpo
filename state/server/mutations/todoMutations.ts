import { useMutation, useQueryClient } from '@tanstack/react-query';
import { names } from '../queryKey';
import todoService from '@/services/todo';

// reusable mutation
export function useTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [names.todos, 'add'],
    mutationFn: (variables: string) => todoService.postTodo(variables),
    onSuccess: (data) => {
      // commented out because we are using polling to refetch the data for demo purposes
      // queryClient.setQueryData<Todo[]>([names.todos], (cache: any) => {
      //   return cache ? [...cache, data] : [data];
      // });
    },
    onError: (error) => {
      console.error('Failed to add todo:', error);
    },
  });
}
