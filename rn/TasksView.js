import React, {useState, useEffect} from 'react';
import Realm from 'realm';
import {Text, Button} from 'react-native';
import {useAuth} from './AuthProvider';
import {Task} from './schemas';

// Should never have two TasksViews open
let gRealm = null;

export function TasksView({projectId}) {
  const {user, logOut} = useAuth();

  const [tasks, setTasks] = useState([]);

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
      <Button title="Log Out" onPress={logOut} />
      <Text>Tasks View</Text>
      {tasks.map((task) => (
        <Text key={task.id}>{task.name}</Text>
      ))}
    </>
  );
}
