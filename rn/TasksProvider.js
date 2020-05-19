import React, {useContext, useState, useEffect} from 'react';
import Realm from 'realm';
import {useAuth} from './AuthProvider';
import {Task} from './schemas';

let gRealm = null;
const TaskContext = React.createContext(null);

const TasksProvider = ({children, projectId}) => {
  const [tasks, setTasks] = useState([]);
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

  const deleteTask = (task) => {
    gRealm.write(() => {
      gRealm.delete(task);
    });
  };

  const setTaskStatus = (task, status) => {
    if (
      ![
        Task.STATUS_OPEN,
        Task.STATUS_IN_PROGRESS,
        Task.STATUS_COMPLETE,
      ].includes(status)
    ) {
      throw new Error(`Invalid Status ${status}`);
    }
    gRealm.write(() => {
      task.status = status;
    });
  };

  const createTask = (newTaskName) => {
    gRealm.write(() => {
      gRealm.create(
        'Task',
        new Task({name: newTaskName || 'New Task', partition: projectId}),
      );
    });
  };

  return (
    <TaskContext.Provider
      value={{
        createTask,
        deleteTask,
        setTaskStatus,
        tasks,
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
