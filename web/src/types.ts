export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ObjectId: any;
};

export type DeleteManyPayload = {
  __typename?: 'DeleteManyPayload';
  deletedCount: Scalars['Int'];
};

export type InsertManyPayload = {
  __typename?: 'InsertManyPayload';
  insertedIds: Array<Maybe<Scalars['ObjectId']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteManyProjects?: Maybe<DeleteManyPayload>;
  deleteManyTasks?: Maybe<DeleteManyPayload>;
  deleteManyUsers?: Maybe<DeleteManyPayload>;
  deleteOneProject?: Maybe<Project>;
  deleteOneTask?: Maybe<Task>;
  deleteOneUser?: Maybe<User>;
  insertManyProjects?: Maybe<InsertManyPayload>;
  insertManyTasks?: Maybe<InsertManyPayload>;
  insertManyUsers?: Maybe<InsertManyPayload>;
  insertOneProject?: Maybe<Project>;
  insertOneTask?: Maybe<Task>;
  insertOneUser?: Maybe<User>;
  replaceOneProject?: Maybe<Project>;
  replaceOneTask?: Maybe<Task>;
  replaceOneUser?: Maybe<User>;
  updateManyProjects?: Maybe<UpdateManyPayload>;
  updateManyTasks?: Maybe<UpdateManyPayload>;
  updateManyUsers?: Maybe<UpdateManyPayload>;
  updateOneProject?: Maybe<Project>;
  updateOneTask?: Maybe<Task>;
  updateOneUser?: Maybe<User>;
  upsertOneProject?: Maybe<Project>;
  upsertOneTask?: Maybe<Task>;
  upsertOneUser?: Maybe<User>;
};


export type MutationDeleteManyProjectsArgs = {
  query?: Maybe<ProjectQueryInput>;
};


export type MutationDeleteManyTasksArgs = {
  query?: Maybe<TaskQueryInput>;
};


export type MutationDeleteManyUsersArgs = {
  query?: Maybe<UserQueryInput>;
};


export type MutationDeleteOneProjectArgs = {
  query: ProjectQueryInput;
};


export type MutationDeleteOneTaskArgs = {
  query: TaskQueryInput;
};


export type MutationDeleteOneUserArgs = {
  query: UserQueryInput;
};


export type MutationInsertManyProjectsArgs = {
  data: Array<ProjectInsertInput>;
};


export type MutationInsertManyTasksArgs = {
  data: Array<TaskInsertInput>;
};


export type MutationInsertManyUsersArgs = {
  data: Array<UserInsertInput>;
};


export type MutationInsertOneProjectArgs = {
  data: ProjectInsertInput;
};


export type MutationInsertOneTaskArgs = {
  data: TaskInsertInput;
};


export type MutationInsertOneUserArgs = {
  data: UserInsertInput;
};


export type MutationReplaceOneProjectArgs = {
  query?: Maybe<ProjectQueryInput>;
  data: ProjectInsertInput;
};


export type MutationReplaceOneTaskArgs = {
  query?: Maybe<TaskQueryInput>;
  data: TaskInsertInput;
};


export type MutationReplaceOneUserArgs = {
  data: UserInsertInput;
  query?: Maybe<UserQueryInput>;
};


export type MutationUpdateManyProjectsArgs = {
  set: ProjectUpdateInput;
  query?: Maybe<ProjectQueryInput>;
};


export type MutationUpdateManyTasksArgs = {
  query?: Maybe<TaskQueryInput>;
  set: TaskUpdateInput;
};


export type MutationUpdateManyUsersArgs = {
  query?: Maybe<UserQueryInput>;
  set: UserUpdateInput;
};


export type MutationUpdateOneProjectArgs = {
  query?: Maybe<ProjectQueryInput>;
  set: ProjectUpdateInput;
};


export type MutationUpdateOneTaskArgs = {
  query?: Maybe<TaskQueryInput>;
  set: TaskUpdateInput;
};


export type MutationUpdateOneUserArgs = {
  query?: Maybe<UserQueryInput>;
  set: UserUpdateInput;
};


export type MutationUpsertOneProjectArgs = {
  query?: Maybe<ProjectQueryInput>;
  data: ProjectInsertInput;
};


export type MutationUpsertOneTaskArgs = {
  query?: Maybe<TaskQueryInput>;
  data: TaskInsertInput;
};


export type MutationUpsertOneUserArgs = {
  data: UserInsertInput;
  query?: Maybe<UserQueryInput>;
};


export type Project = {
  __typename?: 'Project';
  _id?: Maybe<Scalars['ObjectId']>;
  name?: Maybe<Scalars['String']>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type ProjectInsertInput = {
  users?: Maybe<ProjectUsersRelationInput>;
  _id?: Maybe<Scalars['ObjectId']>;
  name?: Maybe<Scalars['String']>;
};

export type ProjectQueryInput = {
  _id_lte?: Maybe<Scalars['ObjectId']>;
  _id_in?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  users_nin?: Maybe<Array<Maybe<UserQueryInput>>>;
  _id_ne?: Maybe<Scalars['ObjectId']>;
  name_exists?: Maybe<Scalars['Boolean']>;
  AND?: Maybe<Array<ProjectQueryInput>>;
  _id?: Maybe<Scalars['ObjectId']>;
  name_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_gt?: Maybe<Scalars['ObjectId']>;
  _id_gte?: Maybe<Scalars['ObjectId']>;
  users_exists?: Maybe<Scalars['Boolean']>;
  name_gt?: Maybe<Scalars['String']>;
  _id_lt?: Maybe<Scalars['ObjectId']>;
  name_lt?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  users?: Maybe<Array<Maybe<UserQueryInput>>>;
  name_lte?: Maybe<Scalars['String']>;
  name_ne?: Maybe<Scalars['String']>;
  users_in?: Maybe<Array<Maybe<UserQueryInput>>>;
  _id_nin?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  OR?: Maybe<Array<ProjectQueryInput>>;
  _id_exists?: Maybe<Scalars['Boolean']>;
  name_gte?: Maybe<Scalars['String']>;
  name_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export enum ProjectSortByInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC'
}

export type ProjectUpdateInput = {
  name?: Maybe<Scalars['String']>;
  name_unset?: Maybe<Scalars['Boolean']>;
  users?: Maybe<ProjectUsersRelationInput>;
  users_unset?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['ObjectId']>;
  _id_unset?: Maybe<Scalars['Boolean']>;
};

export type ProjectUsersRelationInput = {
  create?: Maybe<Array<Maybe<UserInsertInput>>>;
  link?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Query = {
  __typename?: 'Query';
  project?: Maybe<Project>;
  projects: Array<Maybe<Project>>;
  task?: Maybe<Task>;
  tasks: Array<Maybe<Task>>;
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
};


export type QueryProjectArgs = {
  query?: Maybe<ProjectQueryInput>;
};


export type QueryProjectsArgs = {
  query?: Maybe<ProjectQueryInput>;
  limit?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<ProjectSortByInput>;
};


export type QueryTaskArgs = {
  query?: Maybe<TaskQueryInput>;
};


export type QueryTasksArgs = {
  query?: Maybe<TaskQueryInput>;
  limit?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<TaskSortByInput>;
};


export type QueryUserArgs = {
  query?: Maybe<UserQueryInput>;
};


export type QueryUsersArgs = {
  query?: Maybe<UserQueryInput>;
  limit?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<UserSortByInput>;
};

export type Task = {
  __typename?: 'Task';
  _id?: Maybe<Scalars['ObjectId']>;
  assignee?: Maybe<User>;
  description: Scalars['String'];
  status: TaskStatus;
};

export type TaskAssigneeRelationInput = {
  create?: Maybe<UserInsertInput>;
  link?: Maybe<Scalars['String']>;
};

export type TaskInsertInput = {
  status: TaskStatus;
  _id?: Maybe<Scalars['ObjectId']>;
  assignee?: Maybe<TaskAssigneeRelationInput>;
  description: Scalars['String'];
};

export type TaskQueryInput = {
  _id_exists?: Maybe<Scalars['Boolean']>;
  description_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  status_gte?: Maybe<TaskStatus>;
  description?: Maybe<Scalars['String']>;
  status_lte?: Maybe<TaskStatus>;
  assignee?: Maybe<UserQueryInput>;
  _id_in?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  _id_lte?: Maybe<Scalars['ObjectId']>;
  _id_nin?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  assignee_exists?: Maybe<Scalars['Boolean']>;
  _id_ne?: Maybe<Scalars['ObjectId']>;
  status_gt?: Maybe<TaskStatus>;
  OR?: Maybe<Array<TaskQueryInput>>;
  status_lt?: Maybe<TaskStatus>;
  description_gt?: Maybe<Scalars['String']>;
  description_gte?: Maybe<Scalars['String']>;
  description_lte?: Maybe<Scalars['String']>;
  description_lt?: Maybe<Scalars['String']>;
  _id_gt?: Maybe<Scalars['ObjectId']>;
  _id_gte?: Maybe<Scalars['ObjectId']>;
  description_exists?: Maybe<Scalars['Boolean']>;
  description_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  status?: Maybe<TaskStatus>;
  _id?: Maybe<Scalars['ObjectId']>;
  _id_lt?: Maybe<Scalars['ObjectId']>;
  description_ne?: Maybe<Scalars['String']>;
  status_in?: Maybe<Array<Maybe<TaskStatus>>>;
  status_exists?: Maybe<Scalars['Boolean']>;
  AND?: Maybe<Array<TaskQueryInput>>;
  status_ne?: Maybe<TaskStatus>;
  status_nin?: Maybe<Array<Maybe<TaskStatus>>>;
};

export enum TaskSortByInput {
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  AssigneeAsc = 'ASSIGNEE_ASC',
  AssigneeDesc = 'ASSIGNEE_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC'
}

export enum TaskStatus {
  Complete = 'COMPLETE',
  Open = 'OPEN',
  Inprogress = 'INPROGRESS'
}

export type TaskUpdateInput = {
  status?: Maybe<TaskStatus>;
  status_unset?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['ObjectId']>;
  _id_unset?: Maybe<Scalars['Boolean']>;
  assignee?: Maybe<TaskAssigneeRelationInput>;
  assignee_unset?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  description_unset?: Maybe<Scalars['Boolean']>;
};

export type UpdateManyPayload = {
  __typename?: 'UpdateManyPayload';
  matchedCount: Scalars['Int'];
  modifiedCount: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ObjectId']>;
  image?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  projects?: Maybe<Array<Maybe<Project>>>;
  user_id: Scalars['String'];
};

export type UserInsertInput = {
  user_id: Scalars['String'];
  name: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  projects?: Maybe<UserProjectsRelationInput>;
  _id?: Maybe<Scalars['ObjectId']>;
};

export type UserProjectsRelationInput = {
  create?: Maybe<Array<Maybe<ProjectInsertInput>>>;
  link?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
};

export type UserQueryInput = {
  _id?: Maybe<Scalars['ObjectId']>;
  _id_in?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  image_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  user_id_exists?: Maybe<Scalars['Boolean']>;
  name_lt?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  _id_lte?: Maybe<Scalars['ObjectId']>;
  OR?: Maybe<Array<UserQueryInput>>;
  user_id_lte?: Maybe<Scalars['String']>;
  _id_ne?: Maybe<Scalars['ObjectId']>;
  _id_exists?: Maybe<Scalars['Boolean']>;
  image_exists?: Maybe<Scalars['Boolean']>;
  name_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  user_id_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  image_ne?: Maybe<Scalars['String']>;
  projects?: Maybe<Array<Maybe<ProjectQueryInput>>>;
  projects_nin?: Maybe<Array<Maybe<ProjectQueryInput>>>;
  image_lt?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  image_gte?: Maybe<Scalars['String']>;
  user_id_lt?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  _id_lt?: Maybe<Scalars['ObjectId']>;
  user_id_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  user_id_gte?: Maybe<Scalars['String']>;
  name_exists?: Maybe<Scalars['Boolean']>;
  projects_exists?: Maybe<Scalars['Boolean']>;
  image_gt?: Maybe<Scalars['String']>;
  image_lte?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<UserQueryInput>>;
  user_id_ne?: Maybe<Scalars['String']>;
  image_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  name_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  user_id_gt?: Maybe<Scalars['String']>;
  projects_in?: Maybe<Array<Maybe<ProjectQueryInput>>>;
  _id_gte?: Maybe<Scalars['ObjectId']>;
  _id_gt?: Maybe<Scalars['ObjectId']>;
  user_id?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  name_ne?: Maybe<Scalars['String']>;
  _id_nin?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
};

export enum UserSortByInput {
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  ImageAsc = 'IMAGE_ASC',
  ImageDesc = 'IMAGE_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type UserUpdateInput = {
  user_id?: Maybe<Scalars['String']>;
  name_unset?: Maybe<Scalars['Boolean']>;
  user_id_unset?: Maybe<Scalars['Boolean']>;
  image_unset?: Maybe<Scalars['Boolean']>;
  _id_unset?: Maybe<Scalars['Boolean']>;
  projects_unset?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['ObjectId']>;
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  projects?: Maybe<UserProjectsRelationInput>;
};

export type GetAllTasksQueryVariables = {};


export type GetAllTasksQuery = (
  { __typename?: 'Query' }
  & { tasks: Array<Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, '_id' | 'description' | 'status'>
    & { assignee?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'image' | 'user_id'>
    )> }
  )>> }
);

export type AddTaskMutationVariables = {
  task: TaskInsertInput;
};


export type AddTaskMutation = (
  { __typename?: 'Mutation' }
  & { task?: Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, '_id' | 'description' | 'status'>
    & { assignee?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'image' | 'user_id'>
    )> }
  )> }
);

export type UpdateTaskMutationVariables = {
  taskId: Scalars['ObjectId'];
  updates: TaskUpdateInput;
};


export type UpdateTaskMutation = (
  { __typename?: 'Mutation' }
  & { task?: Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, '_id' | 'description' | 'status'>
    & { assignee?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'image' | 'user_id'>
    )> }
  )> }
);

export type DeleteTaskMutationVariables = {
  taskId: Scalars['ObjectId'];
};


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & { deletedTask?: Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, '_id' | 'description' | 'status'>
    & { assignee?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'image' | 'user_id'>
    )> }
  )> }
);

export type GetUserQueryVariables = {
  userId: Scalars['String'];
};


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, '_id' | 'name' | 'image' | 'user_id'>
  )> }
);

export type AddUserMutationVariables = {
  user: UserInsertInput;
};


export type AddUserMutation = (
  { __typename?: 'Mutation' }
  & { insertOneUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, '_id' | 'name' | 'image' | 'user_id'>
  )> }
);
