import React, {useState, useEffect} from 'react';
import Realm from 'realm';
import {Text, Button} from 'react-native';
import {useAuth} from './AuthProvider';
import {Task} from './schemas';
import {TaskItem} from './TaskItem';
import {ActionSheet} from './ActionSheet';
import {Overlay, Input} from 'react-native-elements';
import {styles} from './App';

// Should never have two TasksViews open
let gRealm = null;

function AddTaskView({realm, partition}) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  return (
    <>
      <Overlay isVisible={overlayVisible} overlayStyle={{width: '90%'}}>
        <>
          <Input
            placeholder="New Task Name"
            style={styles.forminput}
            onChangeText={(text) => setNewTaskName(text)}
            autoFocus={true}
          />
          <Button
            title="Create"
            onPress={() => {
              setOverlayVisible(false);
              realm.write(() => {
                realm.create(
                  'Task',
                  new Task({name: newTaskName || 'New Task', partition}),
                );
              });
            }}
          />
        </>
      </Overlay>
      <Button
        title="Add Task"
        onPress={() => {
          setOverlayVisible(true);
        }}
      />
    </>
  );
}

export function TasksView({projectId}) {
  const {user, logOut} = useAuth();

  const [tasks, setTasks] = useState([]);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [actionSheetActions, setActionSheetActions] = useState([]);

  useEffect(() => {
    if (!user) {
      console.error('TasksView must be authenticated!');
      return;
    }

    const config = {
      schema: [Task.schema],
      sync: {
        user,
        partitionValue: `"${projectId}"`,
      },
    };

    console.log(
      `Attempting to open Realm ${projectId} for user ${
        user.identity
      } with config: ${JSON.stringify(config)}...`,
    );
    Realm.open(config)
      .then((realm) => {
        console.log('realm open called');
        gRealm = realm;

        // realm.syncSession.downloadAllServerChanges();
        const syncTasks = realm.objects('Task');
        console.log('syncTasks', syncTasks);
        realm.addListener('change', () => {
          console.log('Changed');
          setTasks([...syncTasks]);
        });

        setTasks([...syncTasks]);
      })
      .catch(console.dir);

    return () => {
      if (gRealm != null) {
        gRealm.removeAllListeners();
        gRealm.close();
        gRealm = null;
      }
    };
  }, [user, projectId]);

  console.log('Got tasks', tasks);

  return (
    <>
      <ActionSheet
        visible={actionSheetVisible}
        closeOverlay={() => setActionSheetVisible(false)}
        actions={actionSheetActions}
      />
      <Button title="Log Out" onPress={logOut} />
      <AddTaskView realm={gRealm} partition={projectId} />
      <Text>Tasks View</Text>
      {tasks.map((task) => (
        <TaskItem
          task={task}
          realm={gRealm}
          setActionSheetVisible={setActionSheetVisible}
          setActionSheetActions={setActionSheetActions}
        />
      ))}
    </>
  );
}
