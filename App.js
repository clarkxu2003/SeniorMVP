import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import ChatScreen from "./src/screens/ChatScreen";
import RemindersScreen from "./src/screens/RemindersScreen";
import { COLORS } from "./src/utils/theme";

const Tab = createBottomTabNavigator();

export default function App() {
  const [todos, setTodos] = useState([
    { id: "t1", text: "Drink water", done: false },
  ]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#080D18",
            borderTopColor: "#1C2742",
            height: 64,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: COLORS.gold,
          tabBarInactiveTintColor: "#7480A0",
          tabBarLabelStyle: { fontWeight: "700" },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-variant" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="microphone"
                color={COLORS.bgBottom}
                size={28}
                style={{
                  backgroundColor: COLORS.gold,
                  padding: 12,
                  borderRadius: 999,
                }}
              />
            ),
          }}
        >
          {(props) => <ChatScreen {...props} todos={todos} setTodos={setTodos} />}
        </Tab.Screen>
        <Tab.Screen
          name="Checklist"
          options={{
            title: "Tasks",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="format-list-checks" color={color} size={size} />
            ),
          }}
        >
          {(props) => (
            <RemindersScreen {...props} todos={todos} setTodos={setTodos} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
