import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import styles from "../stylesheet";
import { ListItem } from "react-native-elements";

export function ProjectsView({ navigation, route }) {
  const { userRealm } = route.params;
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);

  const onClickProject = async (project) => {
    const config = {
      sync: {
        user: user,
        partitionValue: project.partition,
      },
    };

    const projectRealm = await Realm.open(config);
    navigation.navigate("Task List", {
      projectRealm,
      name: project.name,
      projectPartition: project.partition,
    });
  };

  const createUserData = (arrayOfProjectsTheUserIsAMemberOf) => {
    const myUserData = [];
    for (let project of arrayOfProjectsTheUserIsAMemberOf) {
      myUserData.push(project);
    }
    setUserData(myUserData);
  };

  useEffect(() => {
    const users = userRealm.objects("User");
    let memberOf = users[0].memberOf;
    createUserData(memberOf);

    userRealm.addListener("change", () => {
      createUserData(memberOf);
    });
  }, []);

  return (
    <View>
      {userData.map((project, i) => (
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
