import { Text, View } from "react-native";
import { useEffect } from "react";
import SampleA from "@/components/SampleA";
import SampleB from "@/components/SampleB";
import Spinner from "@/components/Spinner";
import { useDedupeQuery } from "@/state/server/queries/dedupeQueries";
import dedupeService from "@/services/dedupe";

export default function Deduping() {
  // Reusable query - TanStack Query handles deduplication automatically
  const myQuery = useDedupeQuery();

  // Function to fetch users
  const fetchUsers = async () => {
    await dedupeService.getUsers();
  };

  // Similar to ngOnInit
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View className="flex-1">
      <View className="p-4 flex-row items-center">
        <Text className="text-xl font-bold">Deduping Page</Text>
        {myQuery.status === "pending" && <Spinner />}
      </View>
      <SampleA />
      <SampleB />
    </View>
  );
}
