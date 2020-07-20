const inquirer = require("inquirer");
const Realm = require("realm");
const mongodb = require("mongodb");
const index = require("./index");

exports.getTasks = async () => {
  const realm = await index.getRealm();
  console.dir(realm);
  const tasks = await realm.objects("Task");
  index.output("MY TASKS:", "header");
  index.output(JSON.stringify(tasks, null, 3), "result");
};

exports.getTask = async () => {
  const realm = await index.getRealm();
  try {
    const task = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "What is the task ID (_id)?",
      },
    ]);
    let result = await realm.objectForPrimaryKey(
      "Task",
      mongodb.ObjectID(task.id)
    );
    if (result !== undefined) {
      index.output("Here is the task you requested:", "header");
      index.output(JSON.stringify(result, " ", 3), "result");
    }
  } catch (err) {
    index.output(err, "error");
  }
};

exports.createTask = async () => {
  const realm = await index.getRealm();
  try {
    index.output("*** CREATE NEW TASK ***", "header");
    const task = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is the task text?",
      },
      {
        type: "rawlist",
        name: "status",
        message: "What is the task status?",
        choices: ["Open", "In Progress", "Closed"],
        default: function () {
          return "Open";
        },
      },
    ]);
    let result;
    realm.write(async () => {
      result = await realm.create("Task", {
        _id: new mongodb.ObjectID(),
        _partition: "myPartition",
        name: task.name,
        status: task.status,
      });
    });

    index.output("New task created", "header");
    index.output(JSON.stringify(result, " ", 3), "result");
  } catch (err) {
    index.output(err, "error");
  }
};

exports.deleteTask = async () => {
  const realm = await index.getRealm();
  index.output("DELETE A TASK", "header");
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "What is the task ID (_id)?",
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Are you sure you want to delete this task?",
    },
  ]);

  if (answers.confirm) {
    let task = await realm.objectForPrimaryKey(
      "Task",
      mongodb.ObjectID(answers.id)
    );
    realm.write(() => {
      realm.delete(task);
      index.output("Task deleted.", "result");
    });
    return;
  }
};

exports.editTask = async () => {
  index.output("CHANGE A TASK", "header");
  let answers = await inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "What is the task ID (_id)?",
    },
    {
      type: "input",
      name: "key",
      message: "What is the field you want to change?",
    },
    {
      type: "input",
      name: "value",
      message: "What is the new value?",
    },
  ]);

  let changeResult = await modifyTask(answers);
  index.output("Task updated.", "result");
  index.output(changeResult, "result");
  return;
};

exports.changeStatus = async () => {
  index.output("Update Task Status", "header");
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "What is the task ID (_id)?",
    },
    {
      type: "rawlist",
      name: "value",
      message: "What is the new status?",
      choices: ["Open", "In Progress", "Closed"],
    },
  ]);

  answers.key = "status";
  let changeResult = await modifyTask(answers);
  index.output("Task updated.", "result");
  index.output(changeResult, "result");
  return;
};

async function modifyTask(answers) {
  const realm = await index.getRealm();
  let task;
  try {
    realm.write(async () => {
      task = await realm.objectForPrimaryKey(
        "Task",
        mongodb.ObjectID(answers.id)
      );
      task[answers.key] = answers.value;
    });
    return JSON.stringify(task, null, 3);
  } catch (err) {
    return index.output(err, "error");
  }
}
