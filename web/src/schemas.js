export const TaskSchema = {
  name: 'Task',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    name: 'string',
    owner: 'string?',
    status: 'string',
  },
  primaryKey: '_id',
};

export const UserSchema = {
  name: 'User',
  properties: {
    _id: 'string',
    _partition: 'string',
    memberOf: 'Project[]',
    name: 'string',
  },
  primaryKey: '_id',
};

export const ProjectSchema = {
  name: 'Project',
  embedded: true,
  properties: {
    name: 'string?',
    partition: 'string?',
  },
};
