import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { ListItem } from "react-native-elements";
import { convertLiveObjectToArray } from "../convertLiveObjectToArray";

export function ProjectsView({ navigation, route }) {
  const { user } = useAuth();
  const [projectData, setProjectData] = useState([]);

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

  // the createProjectData method takes a live object of projects that
  // the logged in user is a member of, and sets the projectData state
  // variable with those projects info as an array
  const createProjectData = (projectsTheUserIsAMemberOf) => {
    const myprojectData = convertLiveObjectToArray(projectsTheUserIsAMemberOf);
    setProjectData(myprojectData);
  };

  useEffect(() => {
    const openRealm = async () => {
      const config = {
        sync: {
          user,
          partitionValue: `user=${user.id}`,
        },
      };
      // open a realm with the logged in user's partition value in order
      // to get the projects that the logged in users is a member of
      const userRealm = await Realm.open(config);
      const users = userRealm.objects("User");
      let memberOf = users[0].memberOf;
      createProjectData(memberOf);
      userRealm.addListener("change", () => {
        createProjectData(memberOf);
      });
    };

    openRealm();
  }, []);

  return (
    <View>
      {projectData.map((project, i) => (
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
