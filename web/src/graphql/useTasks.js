import { useQuery } from "@apollo/client";
import gql from "graphql-tag"
import useProjectActions from "./useProjectActions"

// const useTasks = (project) => {
//   const { data, loading, error } = useQuery(
//     gql`
//       query GetTasksForProject($partition: String!) {
//         tasks(query: { _partition: $partition }) {
//           _id
//           name
//           status
//         }
//       }
//     `,
//     { variables: { partition: project.partition } }
//   );
//   if (error) {
//     throw error;
//   }
  
//   if (loading) {
//     return [];
//   }
//   return data ? data.tasks : [];
// };

const useTasks = (project) => {
  const { addTask, updateTask } = useProjectActions(project);
  const { data, loading, error, refetch } = useQuery(
    gql`
      query GetTasksForProject($partition: String!) {
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
  return {
    loading,
    tasks: data?.tasks ?? [],
    updateTask,
    addTask: async (task) => {
      await addTask(task);
      refetch();
    },
  };
};
export default useTasks
