/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { SafeAreaView, StyleSheet, Text, Button } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { WelcomeView } from "./views/WelcomeView";
import { ProjectsView } from "./views/ProjectsView";
import { TasksView } from "./views/TasksView";

import { Logout } from "./components/Logout";

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <AuthProvider>
      <AppBody />
    </AuthProvider>
  );
};

const AppBody = () => {
  const { signOut } = useAuth();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome View"
            component={WelcomeView}
            title="WelcomeView"
          />
          <Stack.Screen
            name="Project List"
            component={ProjectsView}
            title="ProjectsView"
            headerBackTitle="log out"
            options={{
              headerLeft: ({ navigation }) => <Logout />,
            }}
          />
          <Stack.Screen name="Task List" component={TasksView} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
