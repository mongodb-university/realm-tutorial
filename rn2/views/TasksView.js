import React, { useState } from "react";

import { View, Button } from "react-native";
import styles from "../stylesheet";

import { Overlay, Text } from "react-native-elements";
import { ManageTeam } from "../components/ManageTeam";

export function TasksView({ navigation, route }) {
  const { name, projectRealm } = route.params;
  const [projectTasks, setProjectTasks] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const tasks = projectRealm.objects("Task");

  const listener = (projects, changes) => {
    console.log("proj:::", projects);

    const projTasks = [];
    for (task of projects) {
      projTasks.push(task);
    }

    if (projectTasks.length < projTasks.length) {
      setProjectTasks(myTasks);
    }

    // Update UI in response to deleted objects
    changes.deletions.forEach((index) => {
      // Deleted objects cannot be accessed directly,
      // but we can update a UI list, etc. knowing the index.
    });

    // Update UI in response to inserted objects
    changes.insertions.forEach((index) => {
      let insertedProject = projects[index];
      // ...
    });

    // Update UI in response to modified objects
    changes.modifications.forEach((index) => {
      let modifiedProject = projects[index];
      // ...
    });
  };

  const myTasks = [];
  for (task of tasks) {
    myTasks.push(task);
  }
  if (projectTasks.length < myTasks.length) {
    setProjectTasks(myTasks);
  }

  tasks.addListener(listener);

  return (
    <View>
      <Text>View the tasks for {name}:</Text>

      {projectTasks.map((task) => (
        <View style={styles.projectButtonWrapper}>
          <Button
            title={task.name}
            style={styles.projectButton}
            color="black"
          />
        </View>
      ))}

      <Button title="Manage Team" onPress={() => setOverlayVisible(true)} />

      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={() => setOverlayVisible(false)}
      >
        <ManageTeam />
      </Overlay>
    </View>
  );
}
