import React, {useState} from 'react';
import {Text, Button} from 'react-native';
import {useAuth} from './AuthProvider';
import {useTasks} from './TasksProvider';
import {TaskItem} from './TaskItem';
import {ActionSheet} from './ActionSheet';
import {AddTaskView} from './AddTaskView';

export function TasksView({projectId}) {
  const {tasks} = useTasks();
  const {logOut} = useAuth();

  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [actionSheetActions, setActionSheetActions] = useState([]);

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
