import { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { useTodoMutation } from '../state/server/mutations/todoMutations';

export default function NewTodoScreen() {
  const [todoValue, setTodoValue] = useState('');
  const addTodoMutation = useTodoMutation();

  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-2xl font-bold">Create a new todo</Text>
      <View className="space-y-3">
        <TextInput
          className="rounded border border-gray-300 p-2"
          value={todoValue}
          onChangeText={setTodoValue}
          onEndEditing={() => {
            if (todoValue.trim()) {
              addTodoMutation.mutate(todoValue);
              setTodoValue('');
            }
          }}
          placeholder="Enter todo"
        />
      </View>
    </View>
  );
}
