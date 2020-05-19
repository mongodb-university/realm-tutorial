import React from 'react';
import {SafeAreaView, ScrollView, View, StatusBar} from 'react-native';
import {useAuth} from './AuthProvider';
import {LogInView} from './LogInView';
import {TasksView} from './TasksView';
import {styles} from './App';

// The AppBody is the main view within the App. If a user is not logged in, it
// renders the login view. Otherwise, it renders the tasks view.
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
              <TasksView projectId="My Project" />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
