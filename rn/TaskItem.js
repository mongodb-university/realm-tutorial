import React from 'react';
import {Text} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Task} from './schemas';
import {useTasks} from './TasksProvider';

// The TaskItem represents a Task in a list.
export function TaskItem({
  task,
  realm,
  setActionSheetVisible,
  setActionSheetActions,
}) {
  const {deleteTask, setTaskStatus} = useTasks();
  // Specify the list of available actions in the action list when the item is
  // pressed in the list.
  const actions = [
    {
      title: 'Delete',
      action: () => {
        deleteTask(task);
      },
    },
  ];

  // Make an action to move the task into any other status other than the
  // current status.
  if (task.status !== Task.STATUS_OPEN) {
    actions.push({
      title: 'Mark Open',
      action: () => {
        setTaskStatus(task, Task.STATUS_OPEN);
      },
    });
  }
  if (task.status !== Task.STATUS_IN_PROGRESS) {
    actions.push({
      title: 'Mark In Progress',
      action: () => {
        setTaskStatus(task, Task.STATUS_IN_PROGRESS);
      },
    });
  }
  if (task.status !== Task.STATUS_COMPLETE) {
    actions.push({
      title: 'Mark Complete',
      action: () => {
        setTaskStatus(task, Task.STATUS_COMPLETE);
      },
    });
  }
  return (
    <ListItem
      key={task.id}
      onPress={() => {
        setActionSheetVisible(true);
        setActionSheetActions(actions);
      }}
      title={task.name}
      bottomDivider
      checkmark={
        task.status === Task.STATUS_COMPLETE ? (
          <Text>&#10004;</Text>
        ) : task.status === Task.STATUS_IN_PROGRESS ? (
          <Text>In Progress</Text>
        ) : null
      }
    />
  );
}
