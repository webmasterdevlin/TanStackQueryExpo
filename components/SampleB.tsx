import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { useDedupeQuery } from '@/state/server/queries/dedupeQueries';
import dedupeService from '@/services/dedupe';
import Spinner from './Spinner';

export default function SampleB() {
  // TanStack Query for deduplication
  const myQuery = useDedupeQuery();

  // Function to fetch users
  const fetchUsers = async () => {
    await dedupeService.getUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View className="p-4">
      <View className="flex-row items-center p-4">
        <Text className="mb-2 text-xl font-bold">Sample-B Component</Text>
        {myQuery.status === 'pending' && <Spinner />}
      </View>
    </View>
  );
}
