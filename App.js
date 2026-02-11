import React, { useState } from "react";
import { View } from "react-native";
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
            borderTopWidth: 1,
            height: 68,
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
              <MaterialCommunityIcons
                name="home-variant"
                color={color}
                size={size}
              />
            ),
          }}
        />

        {/* Center Mic (fixed centered + floating) */}
        <Tab.Screen
          name="Chat"
          options={{
            tabBarLabel: "",
            tabBarIcon: () => (
              <View
                style={{
                  width: 72,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: -20, // 调整这个值即可上下微调
                }}
              >
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    backgroundColor: COLORS.gold,
                    alignItems: "center",
                    justifyContent: "center",

                    // 轻微阴影/发光效果（iOS/Android 都尽量兼容）
                    shadowColor: COLORS.gold,
                    shadowOpacity: 0.25,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 6,
                  }}
                >
                  <MaterialCommunityIcons
                    name="microphone"
                    size={26}
                    color={COLORS.bgBottom}
                  />
                </View>
              </View>
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
              <MaterialCommunityIcons
                name="format-list-checks"
                color={color}
                size={size}
              />
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
