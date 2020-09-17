import { useQuery } from "@apollo/client";
import gql from "graphql-tag"
import useTaskMutations from "./useTaskMutations"

const useTasks = (project) => {
  const { tasks, loading } = useAllTasksInProject(project);
  const { addTask, updateTask } = useTaskMutations(project);
  return {
    loading,
    tasks,
    updateTask,
    addTask
  };
};
export default useTasks

function useAllTasksInProject(project) {
  const { data, loading, error } = useQuery(
    gql`
      query GetAllTasksForProject($partition: String!) {
        tasks(query: { _partition: $partition }) {
          _id
          name
          status
        }
      }
    `,
    { variables: { partition: project.partition } }
  );
  if (error) {
    throw error;
  }
  const tasks = data?.tasks ?? []
  return { tasks, loading }
}
