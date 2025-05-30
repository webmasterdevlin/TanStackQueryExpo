import { useQuery } from '@tanstack/react-query';
import dedupeService from '@/services/dedupe';

// reusable query
export function useDedupeQuery() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => dedupeService.getPosts(),
  });
}
