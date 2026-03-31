import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/home/HomeScreen";
import ExpensesScreen from "../screens/expenses/ExpensesScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Dashboard" }}
      />
      <Stack.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ title: "Expenses" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
