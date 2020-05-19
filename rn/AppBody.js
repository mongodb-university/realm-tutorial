import React from 'react';
import {SafeAreaView, ScrollView, View, StatusBar} from 'react-native';
import {useAuth} from './AuthProvider';
import {LogInView} from './LogInView';
import {TasksView} from './TasksView';
import {styles} from './App';
import {TaskProvider} from './TaskProvider';

// The AppBody is the main view within the App. If a user is not logged in, it
// renders the login view. Otherwise, it renders the tasks view. It must be
// within an AuthProvider.
export function AppBody() {
  const {user} = useAuth();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            {user == null ? (
              <LogInView />
            ) : (
              <TaskProvider>
                <TasksView projectId="My Project" />
              </TaskProvider>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
