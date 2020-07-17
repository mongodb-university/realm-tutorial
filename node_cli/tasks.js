const inquirer = require("inquirer");
const realmTasks = require("./realm/realmTasks");
const index = require("./index");

exports.getTasks = async (user) => {
  const tasks = await realmTasks.getTasks(user);
  index.output("MY TASKS:", "header");
  index.output(JSON.stringify(tasks, null, 3), "result");
};

exports.createTask = async (user) => {
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

    const result = await realmTasks.createTask(user, task.name, task.status);

    index.output("New task created", "header");
    index.output(JSON.stringify(result, " ", 3), "result");
  } catch (err) {
    index.output(err, "error");
  }
};

exports.getTask = async (user) => {
  try {
    const task = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "What is the task ID (_id)?",
      },
    ]);

    const result = await realmTasks.getTask(user, task.id);
    if (result !== undefined) {
      index.output("Here is the task you requested:", "header");
      index.output(JSON.stringify(result, " ", 3), "result");
    }
  } catch (err) {
    index.output(err, "error");
  }
};

exports.deleteTask = async (user) => {
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
    let deleteResult = await realmTasks.deleteTask(user, answers.id);
    if (deleteResult) index.output("Task deleted.", "result");
    return;
  }
};

exports.editTask = async (user) => {
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

  let changeResult = await realmTasks.changeTask(user, answers);
  index.output("Task updated.", "result");
  index.output(changeResult, "result");
  return;
};

exports.changeStatus = async (user) => {
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
  let changeResult = await realmTasks.changeTask(user, answers);
  index.output("Task updated.", "result");
  index.output(changeResult, "result");
  return;
};
