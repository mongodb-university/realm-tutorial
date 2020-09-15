import React from "react";
import TaskContent from "./TaskContent";
import Button from "@leafygreen-ui/button";
import Modal from "@leafygreen-ui/modal";

import useProjectActions from "../graphql/useProjectActions";

export default function TaskDetailModal({ project, task, unselectTask }) {
  const TaskStatusButton = useTaskStatusButton(project);
  return (
    <Modal open={Boolean(task)} setOpen={unselectTask}>
      {task && (
        <>
          <TaskContent task={task} />
          {task.status === "Open" && (
            <TaskStatusButton task={task} status="InProgress">
              Start Progress
            </TaskStatusButton>
          )}
          {task.status === "InProgress" && (
            <>
              <TaskStatusButton task={task} status="Open">
                Stop Progress
              </TaskStatusButton>
              <TaskStatusButton task={task} status="Complete">
                Complete
              </TaskStatusButton>
            </>
          )}
          {task.status === "Complete" && (
            <TaskStatusButton task={task} status="InProgress">
              Resume Task
            </TaskStatusButton>
          )}
        </>
      )}
    </Modal>
  );
}
const useTaskStatusButton = (project) => {
  const { updateTask } = useProjectActions(project);
  const TaskStatusButton = ({ task, status, children }) => {
    return (
      <Button onClick={() => updateTask(task, { status })}>{children}</Button>
    );
  };
  return TaskStatusButton;
};
