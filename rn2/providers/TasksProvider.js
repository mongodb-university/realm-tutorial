import React, { useContext, useState, useEffect } from "react";
import Realm from "realm";
import { getRealmApp } from "../getRealmApp";
import { Task } from "../schemas";

// Access the Realm App.
const app = getRealmApp();

// Create a new Context object that will be provided to descendants of the TaskProvider.
const TasksContext = React.createContext(null);

const convertTasksLiveObjectToArray = (liveTaskObject) => {
  const taskArray = [];
  for (task of liveTaskObject) {
    taskArray.push(task);
  }
  return taskArray;
};

// The TaskProvider is responsible for user management and provides the
// TaskContext value to its descendants. Components under an TaskProvider can
// use the useTask() hook to access the task value.
const TasksProvider = ({ children, projectRealm, projectPartition }) => {
  console.log("my projectPartition", projectPartition);
  const createTask = (newTaskName) => {
    projectRealm.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectRealm.create(
        "Task",
        new Task({
          name: newTaskName || "New Task",
          partition: projectPartition,
        })
      );
    });
  };

  const setTaskStatus = (task, status) => {
    // One advantage of centralizing the realm functionality in this provider is
    // that we can check to make sure a valid status was passed in here.
    if (
      ![
        Task.STATUS_OPEN,
        Task.STATUS_IN_PROGRESS,
        Task.STATUS_COMPLETE,
      ].includes(status)
    ) {
      throw new Error(`Invalid Status ${status}`);
    }

    projectRealm.write(() => {
      task.status = status;
    });
  };

  // Define the function for deleting a task.
  const deleteTask = (task) => {
    projectRealm.write(() => {
      projectRealm.delete(task);
    });
  };
  const [tasks, setTasks] = useState([]);
  const projectId = null;

  useEffect(() => {
    const syncTasks = projectRealm.objects("Task");
    setTasks(convertTasksLiveObjectToArray(syncTasks));
    projectRealm.addListener("change", () => {
      setTasks(convertTasksLiveObjectToArray(syncTasks));
    });
  }, []);

  // Render the children within the TaskContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useTasks hook.

  return (
    <TasksContext.Provider
      value={{
        createTask,
        deleteTask,
        setTaskStatus,
        tasks,
        projectId,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

// The useTasks hook can be used by any descendant of the TasksProvider. It
// provides the tasks of the TasksProvider's project and various functions to
// create, update, and delete the tasks in that project.
const useTasks = () => {
  const task = useContext(TasksContext);
  if (task == null) {
    throw new Error("useTasks() called outside of a TasksProvider?");
  }
  return task;
};

export { TasksProvider, useTasks };
