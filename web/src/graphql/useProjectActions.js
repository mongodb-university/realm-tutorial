import { ObjectId } from "bson";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

const useAddTask = (project) => {
  const [addTaskMutation] = useMutation(
    gql`
      mutation AddTask($task: TaskInsertInput!) {
        addedTask: insertOneTask(data: $task) {
          _id
          _partition
          name
          status
        }
      }
    `
  );
  const addTask = async (task) => {
    const { addedTask } = await addTaskMutation({
      variables: {
        task: {
          _id: new ObjectId(),
          _partition: project.partition,
          status: "Open",
          ...task,
        },
      },
    });
    return addedTask;
  }
  return addTask;
}

const useUpdateTask = (project) => {
  const [updateTaskMutation] = useMutation(
    gql`
      mutation UpdateTask($taskId: ObjectId!, $updates: TaskUpdateInput!) {
        updatedTask: updateOneTask(
          query: { _id: $taskId }
          set: $updates
        ) {
          _id
          _partition
          name
          status
        }
      }
    `
  );
  const updateTask = async (task, updates) => {
    const { updatedTask } = await updateTaskMutation({
      variables: { taskId: task._id, updates },
    });
    return updatedTask;
  }
  return updateTask;
}

const useDeleteTask = (project) => {
  const [deleteTaskMutation] = useMutation(
    gql`
      mutation DeleteTask($taskId: ObjectId!) {
        deletedTask: deleteOneTask(query: { _id: taskId }) {
          _id
          _partition
          name
          status
        }
      }
    `
  );
  const deleteTask = async (task) => {
    const { deletedTask } = await deleteTaskMutation({
      variables: { taskId: task._id },
    });
    return deletedTask;
  }
  return deleteTask;
}

const useProjectActions = (project) => ({
  addTask: useAddTask(project),
  updateTask: useUpdateTask(project),
  deleteTask: useDeleteTask(project),
});
export default useProjectActions;
