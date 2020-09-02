import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { ListItem } from "react-native-elements";

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

      if (users[0]) {
        const users = userRealm.objects("User");
        let memberOf = users[0].memberOf;
        setProjectData([...memberOf]);
      } else {
        setProjectData([
          { name: "My Project", partition: `project=${user.id}` },
        ]);
      }

      users.addListener(() => {
        let memberOf = users[0].memberOf;
        setProjectData([...memberOf]);
      });
    };

    openRealm();
  }, []);

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
