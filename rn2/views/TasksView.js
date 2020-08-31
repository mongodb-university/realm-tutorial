import React, { useState } from "react";

import { View, Button } from "react-native";
import styles from "../stylesheet";

import { Overlay, Text } from "react-native-elements";
import { ManageTeam } from "../components/ManageTeam";

import { useTasks } from "../providers/TasksProvider";
import { TaskItem } from "../components/TaskItem";

export function TasksView({ navigation, route }) {
  const { name } = route.params;
  const [overlayVisible, setOverlayVisible] = useState(false);

  const { tasks } = useTasks();

  navigation.setOptions({
    headerRight: () => <Button onPress={() => null} title="Add Tasks" />,
  });

  return (
    <View>
      <Text>View the tasks for {name}:</Text>

      {tasks.map((task) => (
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
      <TaskItem />
    </View>
  );
}
