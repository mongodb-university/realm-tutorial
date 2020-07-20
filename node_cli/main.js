const inquirer = require("inquirer");
const ora = require("ora");

const tasks = require("./tasks");
const index = require("./index");
const watch = require("./watch");
const users = require("./users");

const choice1 = "Create a task";
const choice2 = "Show all of my tasks";
const choice3 = "Get a specific task";
const choice4 = "Change a task status";
const choice5 = "Edit a task";
const choice6 = "Delete a task";
const choice7 = "Watch for changes";
const choice8 = "Log out / Quit";

async function mainMenu() {
  try {
    const answers = await inquirer.prompt({
      type: "rawlist",
      name: "mainMenu",
      message: "What would you like to do?",
      choices: [
        choice1,
        choice2,
        choice3,
        choice4,
        choice5,
        choice6,
        choice7,
        choice8,
        new inquirer.Separator(),
      ],
    });

    switch (answers.mainMenu) {
      case choice1: {
        await tasks.createTask();
        return mainMenu();
      }
      case choice2: {
        await tasks.getTasks();
        return mainMenu();
      }
      case choice3: {
        await tasks.getTask();
        return mainMenu();
      }
      case choice4: {
        await tasks.changeStatus();
        return mainMenu();
      }
      case choice5: {
        await tasks.editTask();
        return mainMenu();
      }
      case choice6: {
        await tasks.deleteTask();
        return mainMenu();
      }
      case choice7: {
        await watch.watchForChanges();
        index.output(
          "We are now watching for changes to the task collection.",
          "result"
        );
        await ora("Watching (use Ctrl-C to quit)").start();
        // Uncomment the next line to continue
        // working rather than waiting while watching
        // return mainMenu();
        break;
      }
      case choice8: {
        const loggedOut = await users.logOut();
        if (!loggedOut) {
          index.output("Error logging out", "error");
        } else
          index.output(
            "You have been logged out. Use Ctrl-C to quit.",
            "result"
          );
        return;
      }
      default: {
        return mainMenu();
      }
    }
  } catch (err) {
    index.output(err, "error");
    return;
  }
}

exports.mainMenu = mainMenu;
