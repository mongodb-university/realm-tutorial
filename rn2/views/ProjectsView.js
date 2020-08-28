import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import styles from "../stylesheet";

export function ProjectsView({ navigation, route }) {
  const { userRealm } = route.params;
  const { user } = useAuth();
  const listener = (users, changes) => {
    // Update UI in response to deleted objects
    changes.deletions.forEach((index) => {
      // Deleted objects cannot be accessed directly,
      // but we can update a UI list, etc. knowing the index.
    });

    // Update UI in response to inserted objects
    changes.insertions.forEach((index) => {
      let insertedUser = users[index];
      // ...
    });

    // Update UI in response to modified objects
    changes.modifications.forEach((index) => {
      let modifiedUser = users[index];
      // ...
    });
  };

  const onClickProject = async (project) => {
    const config = {
      sync: {
        user: user,
        partitionValue: project.partition,
      },
    };
    const projectRealm = await Realm.open(config);
    navigation.navigate("Task List", { projectRealm, name: project.name });
  };

  const users = userRealm.objects("User");
  users.addListener(listener);

  let memberOf = users[0].memberOf;

  const userData = [];
  for (let project of memberOf) {
    userData.push(project);
  }
  // setUserData(myUserData);

  return (
    <View>
      <Text>Click a project that you're a member of:</Text>
      {userData.map((project) => (
        <View style={styles.projectButtonWrapper}>
          <Button
            onPress={() => onClickProject(project)}
            title={`${project.name}'s Tasks`}
            style={styles.projectButton}
            color="black"
          />
        </View>
      ))}
    </View>
  );
}
