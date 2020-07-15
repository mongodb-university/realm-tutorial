let taskSchema = {
  name: "Task",
  primaryKey: "_id",
  properties: {
    _id: "objectId",
    _partition: "string",
    assignee: "objectId",
    name: "string",
    status: "string",
  },
};

module.exports.taskSchema = taskSchema;
