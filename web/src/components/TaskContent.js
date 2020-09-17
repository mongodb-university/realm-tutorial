import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";

export default function TaskContent({ task }) {
  return (
    <TaskDescription>
      <TaskName>{task.name}</TaskName>
      <Badge variant={getColorForStatus(task.status)}>
        {getTaskStatusDisplayName(task.status)}
      </Badge>
    </TaskDescription>
  );
}

const TaskDescription = styled.div`
  display: flex;
  width: 100%;
`;
const TaskName = styled.span`
  flex-grow: 1;
`;

const getColorForStatus = (status) => {
  switch (status) {
    case "Open":
      return "blue";
    case "InProgress":
      return "yellow";
    case "Complete":
      return "green";
    default:
      return "gray";
  }
};

const getTaskStatusDisplayName = (status) => {
  const nbsp = String.fromCharCode(160); // Non-breaking space so that a badge is always one line
  if (status === "InProgress") {
    return `In${nbsp}Progress`;
  }
  return status;
};
