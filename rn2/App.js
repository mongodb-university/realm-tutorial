/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

import {AuthProvider, useAuth} from './providers/AuthProvider';
import {WelcomeView} from './views/WelcomeView';
import {ProjectsView} from './views/ProjectsView';
import {TasksView} from './views/TasksView';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  // const {user, logOut} = useAuth();
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name=" " component={WelcomeView} title="WelcomeView" />
          <Stack.Screen
            name="Project List"
            component={ProjectsView}
            title="ProjectsView"
          />
          <Stack.Screen name="Task List" component={TasksView} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
