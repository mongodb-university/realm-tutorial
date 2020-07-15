var Realm = require("realm");
var mongodb = require("mongodb");
const schemas = require("./schemas");
const index = require("../index");

async function setRealm(user) {
  const config = {
    schema: [schemas.TaskSchema, schemas.UserSchema, schemas.ProjectSchema],
    sync: {
      user: user,
      partitionValue: "myPartition",
    },
  };

  return await Realm.open(config).then((r) => {
    return r;
  });
}

async function getTasks(user) {
  return setRealm(user)
    .then(async (r) => {
      let allTasks = await r.objects("Task");
      return allTasks;
    })
    .catch((err) => {
      return index.output(err, "error");
    });
}

async function getTask(user, taskId) {
  return setRealm(user)
    .then(async (r) => {
      let task = await r.objectForPrimaryKey("Task", mongodb.ObjectID(taskId));
      return task;
    })
    .catch((err) => {
      return index.output(err, "error");
    });
}

async function createTask(user, taskName, taskStatus) {
  return setRealm(user).then(async (r) => {
    try {
      r.beginTransaction();
      let t = await r.create("Task", {
        _id: new mongodb.ObjectID(),
        _partition: "myPartition",
        name: taskName,
        status: taskStatus,
      });
      r.commitTransaction();
      return t;
    } catch (err) {
      r.cancelTransaction();
      return index.output(err, "error");
    }
  });
}

async function changeTask(user, answers) {
  return setRealm(user).then(async (r) => {
    try {
      r.beginTransaction();
      let task = await r.objectForPrimaryKey(
        "Task",
        mongodb.ObjectID(answers.id)
      );
      task[answers.key] = answers.value;
      r.commitTransaction();
      return JSON.stringify(task, null, 3);
    } catch (err) {
      r.cancelTransaction();
      return index.output(err, "error");
    }
  });
}

async function deleteTask(user, taskId) {
  return setRealm(user).then(async (r) => {
    try {
      r.beginTransaction();
      let task = await r.objectForPrimaryKey("Task", mongodb.ObjectID(taskId));
      r.delete(task);
      r.commitTransaction();
      return true;
    } catch (err) {
      r.cancelTransaction();
      index.output(err, "error");
      return false;
    }
  });
}

//TODO: watch for task changes!

module.exports.getTask = getTask;
module.exports.changeTask = changeTask;
module.exports.getTasks = getTasks;
module.exports.createTask = createTask;
module.exports.deleteTask = deleteTask;
