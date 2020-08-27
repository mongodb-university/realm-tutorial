import React, { useState } from "react";

import { Text, View, Button } from "react-native";
import styles from "../stylesheet";

export function TasksView({ navigation, route }) {
  const { name, projectRealm } = route.params;
  const [projectTasks, setProjectTasks] = useState([]);
  const tasks = projectRealm.objects("Task");
  console.log("tasks:", tasks);

  const myTasks = [];
  for (task of tasks) {
    console.log(task);
    myTasks.push(task);
  }

  if (projectTasks.length < myTasks.length) {
    setProjectTasks(myTasks);
  }

  console.log(projectTasks);
  // setProjectTasks(myTasks);

  //   let memberOf = users[0].memberOf;

  // const userData = [];
  // for (let project of memberOf) {
  //   userData.push(project);
  // }

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
    </View>
  );
}
