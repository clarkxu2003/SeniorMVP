import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import ChatScreen from "./src/screens/ChatScreen";
import RemindersScreen from "./src/screens/RemindersScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [todos, setTodos] = useState([{ id: "t1", text: "Drink water", done: false }]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat">
          {(props) => <ChatScreen {...props} todos={todos} setTodos={setTodos} />}
        </Stack.Screen>
        <Stack.Screen name="Reminders">
          {(props) => (
            <RemindersScreen {...props} todos={todos} setTodos={setTodos} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
