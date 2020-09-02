import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import styles from "../stylesheet";
import { ListItem } from "react-native-elements";

export function ProjectsView({ navigation, route }) {
  const { user } = useAuth();

  const [userData, setUserData] = useState([]);

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

  const createUserData = (arrayOfProjectsTheUserIsAMemberOf) => {
    const myUserData = [];
    for (let project of arrayOfProjectsTheUserIsAMemberOf) {
      myUserData.push(project);
    }
    setUserData(myUserData);
  };

  useEffect(() => {
    const openRealm = async () => {
      const config = {
        sync: {
          user,
          partitionValue: `user=${user.id}`,
        },
      };
      const userRealm = await Realm.open(config);
      const users = userRealm.objects("User");

      let memberOf = users[0].memberOf;
      createUserData(memberOf);
      userRealm.addListener("change", () => {
        createUserData(memberOf);
      });
    };

    openRealm();
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
