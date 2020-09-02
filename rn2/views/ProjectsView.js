import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { ListItem } from "react-native-elements";

export function ProjectsView({ navigation, route }) {
  const { user, projectData } = useAuth();

  // the onClickProject navigates to the Task List with the project name
  // and project partition value
  const onClickProject = async (project) => {
    try {
      navigation.navigate("Task List", {
        name: project.name,
        projectPartition: project.partition,
      });
    } catch (err) {
      throw `error opening user realm ${err}`;
    }
  };

  return (
    <View>
      {projectData.map((project) => (
        <View key={project.name}>
          <ListItem
            title={project.name}
            onPress={() => onClickProject(project)}
            bottomDivider
            key={project.name}
          />
        </View>
      ))}
    </View>
  );
}
