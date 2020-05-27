import * as React from "react";
import { Task, TaskStatus, User } from "../types";

import {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "./../graphql-operations";

interface UpdatedTask {
  status?: TaskStatus;
  description?: string;
  assignee?: User;
}

export interface TaskActions {
  addTask: (task: Task) => Promise<void>;
  updateTask: (taskId: string, updated: UpdatedTask) => Promise<void>;
  deleteTask: (task: Task) => Promise<void>;
}

export function useTasks(): {
  tasks: Array<Task>;
  loading: boolean;
  actions: TaskActions;
} {
  const [tasks, setTasks] = React.useState<Task[]>([]);

  // Query for Tasks
  const { loading, error, data } = useGetAllTasksQuery();
  React.useEffect(() => {
    // Throw if there's an error
    if (error) throw error;

    // Wait for the query to finish loading and update state with the returned tasks
    if (!loading && data?.tasks) {
      setTasks(data.tasks as Task[]);
    }
  }, [loading, error, data]);

  // Create Task Mutation Functions
  const [addTaskMutation] = useAddTaskMutation();
  const [updateTaskMutation] = useUpdateTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();

  const addTask = async (task: Task) => {
    const variables = {
      task: {
        status: task.status,
        description: task.description,
        assignee: task.assignee ? { link: task.assignee.user_id } : undefined,
      },
    };
    const currentTasks = [...tasks];
    try {
      const result = await addTaskMutation({ variables });
      const task = result.data?.task as Task;
      setTasks([...tasks, task]);
    } catch (err) {
      setTasks(currentTasks);
      throw new Error("Unable to add task");
    }
  };

  const updateTask = async (taskId: string, updated: UpdatedTask) => {
    const variables = {
      taskId: taskId,
      updates: {
        status: updated?.status ?? undefined,
        description: updated?.description ?? undefined,
        assignee: updated.assignee
          ? { link: updated.assignee.user_id }
          : undefined,
      },
    };
    const isSpecifiedTask = (t: Task) => t._id === taskId;
    const currentTasks = [...tasks];
    const currentTask = currentTasks.find(isSpecifiedTask);
    if (!currentTask) {
      return;
    }
    try {
      const result = await updateTaskMutation({ variables });
      const updatedTask: Task = result.data?.task as Task;
      setTasks([...tasks.filter((t) => !isSpecifiedTask(t)), updatedTask]);
    } catch (err) {
      setTasks(currentTasks);
      throw new Error("Unable to update task");
    }
  };

  const deleteTask = async (task: Task) => {
    const variables = { taskId: task._id };
    const currentTasks = [...tasks];
    try {
      await deleteTaskMutation({ variables });
      setTasks([...tasks.filter((t) => t._id !== task._id)]);
    } catch (err) {
      setTasks(currentTasks);
      throw new Error("Unable to delete task");
    }
  };

  return {
    tasks,
    loading,
    actions: {
      addTask,
      updateTask,
      deleteTask,
    },
  };
}
