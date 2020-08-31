import React, { useState } from "react";
import { Text, ListItem, BottomSheet } from "react-native-elements";
// import { Task } from "./schemas";
import { useTasks } from "../providers/TasksProvider";
import { View, Button } from "react-native";

export function TaskItem({ task }) {
  // Pull the task actions from the TasksProvider.
  const { deleteTask, setTaskStatus } = useTasks();

  const [isVisible, setIsVisible] = useState(false);

  // const list = [
  //   { title: "List Item 1" },
  //   { title: "List Item 2" },
  //   {
  //     title: "Cancel",
  //     containerStyle: { backgroundColor: "red" },
  //     titleStyle: { color: "white" },
  //     onPress: () => setIsVisible(false),
  //   },
  // ];
  return (
    <View>
      <Button
        title="toggle bottom sheet"
        onPress={() => setIsVisible(!isVisible)}
      />
      <BottomSheet isVisible={true}>
        <Text>foo</Text>
        <Text>bar</Text>
        <Text>bat</Text>
        {/* {list.map((l, i) => (
        <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
          <ListItem.Content>
            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))} */}
      </BottomSheet>
    </View>
  );
}
