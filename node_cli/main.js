const inquirer = require("inquirer");
const tasks = require("./tasks");
const { logout } = require("./realm/realmAuth");
const index = require("./index");

async function mainMenu(authedUser) {
  try {
    const answers = await inquirer.prompt({
      type: "rawlist",
      name: "mainMenu",
      message: "What would you like to do?",
      choices: [
        "Create a task",
        "Show all of my tasks",
        "Get a specific task",
        "Change a task status",
        "Edit a task",
        "Delete a task",
        "Watch for changes",
        "Log out / Quit",
      ],
    });

    switch (answers.mainMenu) {
      case "Create a task": {
        await tasks.createTask(authedUser);
        return mainMenu(authedUser);
      }
      case "Show all of my tasks": {
        await tasks.getTasks(authedUser);
        return mainMenu(authedUser);
      }
      case "Get a specific task": {
        await tasks.getTask(authedUser);
        return mainMenu(authedUser);
      }
      case "Change a task status": {
        await tasks.changeStatus(authedUser);
        return mainMenu(authedUser);
      }
      case "Edit a task": {
        await tasks.editTask(authedUser);
        return mainMenu(authedUser);
      }
      case "Delete a task": {
        await tasks.deleteTask(authedUser);
        return mainMenu(authedUser);
      }
      case "Watch for changes": {
        //TODO
      }
      case "Log out / Quit": {
        const loggedOut = await logout();
        if (!loggedOut) index.output("Error logging out", "error");
        else
          index.output(
            "You have been logged out. Use Ctrl-C to quit.",
            "result"
          );
        return;
      }
      default: {
        return mainMenu(authedUser);
      }
    }
  } catch (err) {
    index.output(err, "error");
    return;
  }
}

exports.mainMenu = mainMenu;
