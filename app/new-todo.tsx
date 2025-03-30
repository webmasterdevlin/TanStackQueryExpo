import { useState } from "react";
import { Text, View, TextInput, Button, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.title}>Create a new todo</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
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
          <Text style={styles.errorText}>
            Error: {addTodoMutation.error.message}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  errorText: {
    color: "red",
  },
});
