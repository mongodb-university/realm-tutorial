import React from 'react';
import {Text} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Task} from './schemas';
import {useTask} from './TaskProvider';

// The TaskItem represents a Task in a list.
export function TaskItem({
  task,
  realm,
  setActionSheetVisible,
  setActionSheetActions,
}) {
  const {createTask} = useTask();
  const actions = [
    {
      title: 'Delete',
      action: () => {
        realm.write(() => {
          realm.delete(task);
        });
      },
    },
  ];
  if (task.status !== Task.STATUS_OPEN) {
    actions.push({
      title: 'Mark Open',
      action: () => {
        realm.write(() => {
          task.status = Task.STATUS_OPEN;
        });
      },
    });
  }
  if (task.status !== Task.STATUS_IN_PROGRESS) {
    actions.push({
      title: 'Mark In Progress',
      action: () => {
        realm.write(() => {
          task.status = Task.STATUS_IN_PROGRESS;
        });
      },
    });
  }
  if (task.status !== Task.STATUS_COMPLETE) {
    actions.push({
      title: 'Mark Complete',
      action: () => {
        realm.write(() => {
          task.status = Task.STATUS_COMPLETE;
        });
      },
    });
  }
  return (
    <ListItem
      key={task.id}
      onPress={() => {
        console.log('\n\n\nuseTask', createTask());
        console.log('\n\n\n');
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
