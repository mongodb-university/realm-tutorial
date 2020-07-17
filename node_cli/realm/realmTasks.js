const Realm = require("realm");
const mongodb = require("mongodb");
const schemas = require("./schemas");
const index = require("../index");

async function openRealm(user) {
  const config = {
    schema: [schemas.TaskSchema, schemas.UserSchema, schemas.ProjectSchema],
    sync: {
      user: user,
      partitionValue: "myPartition",
    },
  };
  return await Realm.open(config);
}

async function getTasks(user) {
  try {
    const realm = await openRealm(user);
    return await realm.objects("Task");
  } catch (err) {
    return index.output(err, "error");
  }
}

async function getTask(user, taskId) {
  try {
    const realm = await openRealm(user);
    return await realm.objectForPrimaryKey("Task", mongodb.ObjectID(taskId));
  } catch (err) {
    return index.output(err, "error");
  }
}

async function createTask(user, taskName, taskStatus) {
  const realm = await openRealm(user);
  try {
    realm.beginTransaction();
    let newTask = await realm.create("Task", {
      _id: new mongodb.ObjectID(),
      _partition: "myPartition",
      name: taskName,
      status: taskStatus,
    });
    realm.commitTransaction();
    return newTask;
  } catch (err) {
    realm.cancelTransaction();
    return index.output(err, "error");
  }
}

async function changeTask(user, answers) {
  const realm = await openRealm(user);
  try {
    realm.beginTransaction();
    let task = await realm.objectForPrimaryKey(
      "Task",
      mongodb.ObjectID(answers.id)
    );
    task[answers.key] = answers.value;
    realm.commitTransaction();
    return JSON.stringify(task, null, 3);
  } catch (err) {
    realm.cancelTransaction();
    return index.output(err, "error");
  }
}

async function deleteTask(user, taskId) {
  const realm = await openRealm(user);
  try {
    realm.beginTransaction();
    let task = await realm.objectForPrimaryKey(
      "Task",
      mongodb.ObjectID(taskId)
    );
    realm.delete(task);
    realm.commitTransaction();
    return true;
  } catch (err) {
    realm.cancelTransaction();
    index.output(err, "error");
    return false;
  }
}

//TODO: watch for task changes!

module.exports.getTask = getTask;
module.exports.changeTask = changeTask;
module.exports.getTasks = getTasks;
module.exports.createTask = createTask;
module.exports.deleteTask = deleteTask;
module.exports.openRealm = openRealm;
