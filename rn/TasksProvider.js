import React, {useContext, useState, useEffect} from 'react';
import Realm from 'realm';
import {useAuth} from './AuthProvider';

let gRealm = null;
const TaskContext = React.createContext(null);

const TasksProvider = ({children}) => {
  const {user} = useAuth();
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
  const createTask = async () => {
    // return await setTimeout(() => console.log('ran createTask'), 1000);
    realm.write(() => {
      realm.create(
        'Task',
        new Task({name: newTaskName || 'New Task', partition}),
      );
    });
  };
  return (
    <TaskContext.Provider
      value={{
        createTask,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

const useTasks = () => {
  const _task = useContext(TaskContext);
  if (_task == null) {
    throw new Error('useTasks() called outside of a TasksProvider?');
  }
  return _task;
};
export {TasksProvider, useTasks};
