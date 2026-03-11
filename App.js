import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import ChatScreen from "./src/screens/ChatScreen";
import RemindersScreen from "./src/screens/RemindersScreen";
import FoodOrderScreen from "./src/screens/FoodOrderScreen";
import { COLORS } from "./src/utils/theme";

const Tab = createBottomTabNavigator();

export default function App() {
  const [todos, setTodos] = useState([
    {
      id: "1",
      text: "Take medicine at 8 PM",
      completed: false,
    },
    {
      id: "2",
      text: "Call daughter tomorrow morning",
      completed: false,
    },
  ]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: COLORS.bgBottom,
            borderTopColor: "rgba(212,175,55,0.18)",
            height: 88,
            paddingTop: 8,
            paddingBottom: 12,
          },
          tabBarActiveTintColor: COLORS.gold2,
          tabBarInactiveTintColor: COLORS.muted,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
            marginTop: 2,
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Home") {
              return (
                <MaterialCommunityIcons
                  name="home"
                  size={size || 24}
                  color={color}
                />
              );
            }

            if (route.name === "Chat") {
              return (
                <MaterialCommunityIcons
                  name="microphone"
                  size={size || 24}
                  color={color}
                />
              );
            }

            if (route.name === "Checklist") {
              return (
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={size || 24}
                  color={color}
                />
              );
            }

            if (route.name === "FoodOrder") {
              return (
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={size || 24}
                  color={color}
                />
              );
            }

            return (
              <MaterialCommunityIcons
                name="circle"
                size={size || 24}
                color={color}
              />
            );
          },
          tabBarButton: (props) => (
            <TouchableOpacity {...props} activeOpacity={0.85} />
          ),
        })}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: "Home",
          }}
        >
          {(props) => <HomeScreen {...props} />}
        </Tab.Screen>

        <Tab.Screen
          name="Chat"
          options={{
            tabBarLabel: "Chat",
          }}
        >
          {(props) => (
            <ChatScreen {...props} todos={todos} setTodos={setTodos} />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Checklist"
          options={{
            tabBarLabel: "Tasks",
          }}
        >
          {(props) => (
            <RemindersScreen {...props} todos={todos} setTodos={setTodos} />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="FoodOrder"
          options={{
            tabBarLabel: "Food",
          }}
        >
          {(props) => <FoodOrderScreen {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}