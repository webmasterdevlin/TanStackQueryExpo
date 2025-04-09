import { QueryClient } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

// Create a persister for TanStack Query
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'TANSTACK_QUERY_CACHE', // Unique key for TanStack Query cache
  throttleTime: 1000, // Only persist changes every 1000ms
  serialize: (data) => JSON.stringify(data),
  deserialize: (data) => JSON.parse(data),
});

const TanStackProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            networkMode: 'always',
            retry: 1,
            gcTime: 1000 * 60 * 60 * 24, // Keep data in cache for 24 hours
          },
        },
      })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}>
      {children}
    </PersistQueryClientProvider>
  );
};

export default TanStackProvider;
