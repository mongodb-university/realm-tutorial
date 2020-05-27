export type ObjectID = string;
export type UserID = string;

export type Project = {
  _id: ObjectID;
  name: string;
  users: UserID[];
};

export type Task = {
  _id: ObjectID;
  assignee?: User;
  status: TaskStatus;
  description: string;
};

export type User = {
  _id: ObjectID;
  user_id: UserID;
  name: string;
  image?: string;
};

export enum TaskStatus {
  Open = "Open",
  InProgress = "InProgress",
  Complete = "Complete",
}

export const statusMap = new Map<string, TaskStatus>([
  ["Open", TaskStatus.Open],
  ["InProgress", TaskStatus.InProgress],
  ["Complete", TaskStatus.Complete],
]);
