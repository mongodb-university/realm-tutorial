const inquirer = require("inquirer");
const ora = require("ora");

const tasks = require("./tasks");
const index = require("./index");
const watch = require("./watch");
const users = require("./users");

const create_task = "Create a task";
const show_all = "Show all of my tasks";
const get_task = "Get a specific task";
const change_status = "Change a task status";
const edit_task = "Edit a task";
const delete_task = "Delete a task";
const watch_for_changes = "Watch for changes";
const logout = "Log out / Quit";

async function mainMenu() {
  try {
    const answers = await inquirer.prompt({
      type: "rawlist",
      name: "mainMenu",
      message: "What would you like to do?",
      choices: [
        create_task,
        show_all,
        get_task,
        change_status,
        edit_task,
        delete_task,
        watch,
        logout,
        new inquirer.Separator(),
      ],
    });

    switch (answers.mainMenu) {
      case create_task: {
        await tasks.createTask();
        return mainMenu();
      }
      case show_all: {
        await tasks.getTasks();
        return mainMenu();
      }
      case get_task: {
        await tasks.getTask();
        return mainMenu();
      }
      case change_status: {
        await tasks.changeStatus();
        return mainMenu();
      }
      case edit_task: {
        await tasks.editTask();
        return mainMenu();
      }
      case delete_task: {
        await tasks.deleteTask();
        return mainMenu();
      }
      case watch_for_changes: {
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
      case logout: {
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
