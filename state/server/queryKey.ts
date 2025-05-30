/*
NOTE: I am not using this for simple demo purposes on the conference
*/

// Type-safe query key factory
export const queryKeys = {
  // Movies
  movies: () => ['movies'] as const,
  movie: (id: string) => ['movies', id] as const,

  // Commodities
  commodities: () => ['commodities'] as const,
  commoditiesPaginated: (page: number, perPage: number) =>
    ['commodities', 'paginated', page, perPage] as const,

  // Reports
  reports: () => ['reports'] as const,
  report: (id: string) => ['reports', id] as const,

  // Todos
  todos: () => ['todos'] as const,
  todo: (id: string) => ['todos', id] as const,

  // Posts (for deduping demo)
  posts: () => ['posts'] as const,

  // Users
  users: () => ['users'] as const,
} as const;

// Type helpers
export type QueryKey = ReturnType<(typeof queryKeys)[keyof typeof queryKeys]>;
export type QueryKeyFactory = typeof queryKeys;
