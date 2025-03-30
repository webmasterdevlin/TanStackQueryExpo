import { View, Text } from "react-native";
import { useEffect } from "react";
import { useDedupeQuery } from "@/state/server/queries/dedupeQueries";
import dedupeService from "@/services/dedupe";
import Spinner from "./Spinner";

export default function SampleB() {
  // TanStack Query for deduplication
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
    <View className="p-4">
      <Text className="text-xl font-bold mb-2">Sample-B Component</Text>
      {myQuery.status === "pending" && <Spinner />}
    </View>
  );
}
