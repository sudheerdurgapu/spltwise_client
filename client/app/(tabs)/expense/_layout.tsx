import { Stack } from "expo-router";

const ExpenseLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-item"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="item"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ExpenseLayout;
