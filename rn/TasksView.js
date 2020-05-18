import React, {useState, useEffect} from 'react';
import Realm from 'realm';
import {Text, Button, View} from 'react-native';
import {ListItem, Overlay} from 'react-native-elements';
import {useAuth} from './AuthProvider';
import {Task} from './schemas';

// Should never have two TasksViews open
let gRealm = null;

const ActionSheet = ({actions, visible, closeOverlay}) => {
  console.log('Actions:', actions);
  return (
    <Overlay
      overlayStyle={{width: '90%'}}
      isVisible={visible}
      onBackdropPress={closeOverlay}>
      <>
        {actions.map(({title, action}) => (
          <ListItem
            key={title}
            title={title}
            onPress={() => {
              closeOverlay();
              action();
            }}
          />
        ))}
      </>
    </Overlay>
  );
};

function TaskItem({task, realm, setActionSheetVisible, setActionSheetActions}) {
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
        setActionSheetVisible(true);
        setActionSheetActions(actions);
      }}
      title={task.name}
      bottomDivider
    />
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
      `Attempting to open Realm ${projectId} for user ${user.identity}...`,
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
