import { useQuery } from '@tanstack/react-query';
import { names } from '../queryKey';
import dedupeService from '@/services/dedupe';

// reusable query
export function useDedupeQuery() {
  return useQuery({
    queryKey: [names.posts],
    queryFn: () => dedupeService.getPosts(),
  });
}
