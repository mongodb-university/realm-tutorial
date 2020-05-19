import React, {useContext, useState} from 'react';
import Realm from 'realm';

const TaskContext = React.createContext(null);

const TaskProvider = ({children}) => {
  const createTask = async () => {
    return await setTimeout(() => console.log('ran createTask'), 1000);
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
    throw new Error('useTasks() called outside of a TaskProvider?');
  }
  return _task;
};
export {TaskProvider, useTasks};
