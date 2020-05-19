import React, {useState, useEffect} from 'react';
import Realm from 'realm';
import {Text, Button} from 'react-native';
import {useAuth} from './AuthProvider';
import {Task} from './schemas';
import {TaskItem} from './TaskItem';
import {ActionSheet} from './ActionSheet';
import {AddTaskView} from './AddTaskView';

export function TasksView({projectId}) {
  const {logOut} = useAuth();

  const [tasks, setTasks] = useState([]);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [actionSheetActions, setActionSheetActions] = useState([]);

  console.log('Got tasks', tasks);

  return (
    <>
      <ActionSheet
        visible={actionSheetVisible}
        closeOverlay={() => setActionSheetVisible(false)}
        actions={actionSheetActions}
      />
      <Button title="Log Out" onPress={logOut} />
      <AddTaskView />
      <Text>Tasks View</Text>
      {tasks.map((task) => (
        <TaskItem
          task={task}
          setActionSheetVisible={setActionSheetVisible}
          setActionSheetActions={setActionSheetActions}
        />
      ))}
    </>
  );
}
