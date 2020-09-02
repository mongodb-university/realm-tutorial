import React, { useContext, useState, useEffect } from "react";
import Realm from "realm";
import { getRealmApp } from "../getRealmApp";
import { Task } from "../schemas";
import { useAuth } from "./AuthProvider";
import { convertLiveObjectToArray } from "../convertLiveObjectToArray";
// Access the Realm App.
const app = getRealmApp();

const TasksContext = React.createContext(null);

// declared a projectRealm variable to be defined later, with an open realm
let projectRealm;

const TasksProvider = ({ children, projectPartition }) => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

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

  useEffect(() => {
    const openRealm = async () => {
      const config = {
        sync: {
          user: user,
          partitionValue: projectPartition,
        },
      };
      // open a realm for this particular project
      projectRealm = await Realm.open(config);

      const syncTasks = projectRealm.objects("Task");
      let sortedTasks = syncTasks.sorted("name");
      setTasks(convertLiveObjectToArray(sortedTasks));
      projectRealm.addListener("change", () => {
        setTasks(convertLiveObjectToArray(sortedTasks));
      });
    };
    openRealm();
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
    throw new Error("useTasks() called outside of a TasksProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return task;
};

export { TasksProvider, useTasks };