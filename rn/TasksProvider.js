import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm, {exists} from 'realm';
import {useAuth} from './AuthProvider';
import {Task} from './schemas';

const TaskContext = React.createContext(null);

const TasksProvider = ({children, projectId}) => {
  const [tasks, setTasks] = useState([]);
  const realmRef = useRef();
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

    if (realmRef.current != null) {
      realmRef.current.removeAllListeners();
      realmRef.current.close();
      realmRef.current = null;
    }

    Realm.open(config)
      .then((openedRealm) => {
        const syncTasks = openedRealm.objects('Task');
        openedRealm.addListener('change', () => {
          setTasks([...syncTasks]);
        });
        setTasks([...syncTasks]);
        realmRef.current = openedRealm;
      })
      .catch(console.error);

    return () => {
      const realm = realmRef.current;
      if (realm != null) {
        realm.removeAllListeners();
        realm.close();
        realmRef.current = null;
      }
    };
  }, [user, projectId]);

  const deleteTask = (task) => {
    const realm = realmRef.current;
    realm.write(() => {
      realm.delete(task);
    });
  };

  const setTaskStatus = (task, status) => {
    const realm = realmRef.current;
    if (
      ![
        Task.STATUS_OPEN,
        Task.STATUS_IN_PROGRESS,
        Task.STATUS_COMPLETE,
      ].includes(status)
    ) {
      throw new Error(`Invalid Status ${status}`);
    }
    realm.write(() => {
      task.status = status;
    });
  };

  const createTask = (newTaskName) => {
    const realm = realmRef.current;
    realm.write(() => {
      realm.create(
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
