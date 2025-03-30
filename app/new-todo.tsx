import { useState } from "react";
import { Text, View, TextInput, Button } from "react-native";
import { useTodoMutation } from "../state/server/mutations/todoMutations";

export default function NewTodo() {
  const [todoValue, setTodoValue] = useState("");
  const addTodoMutation = useTodoMutation();

  const handleSubmit = () => {
    if (todoValue.trim()) {
      addTodoMutation.mutate(todoValue);
      setTodoValue("");
    }
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Create a new todo</Text>
      <View className="space-y-3">
        <TextInput
          className="border border-gray-300 rounded p-2"
          value={todoValue}
          onChangeText={setTodoValue}
          placeholder="Enter something"
        />
        <Button
          title="Add Todo"
          onPress={handleSubmit}
          disabled={addTodoMutation.isPending}
        />
        {addTodoMutation.isPending && <Text>Adding todo...</Text>}
        {addTodoMutation.isError && (
          <Text className="text-red-500">
            Error: {addTodoMutation.error.message}
          </Text>
        )}
      </View>
    </View>
  );
}
