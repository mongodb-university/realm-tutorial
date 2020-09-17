const inquirer = require("inquirer");
const ora = require("ora");

const tasks = require("./tasks");
const index = require("./index");
const watch = require("./watch");
const users = require("./users");
const output = require("./output");
const manageTeam = require("./manageTeam");
const { ProjectSchema } = require("./schemas");
const projects = require("./projects");

const Choices = {
  ShowProjects: "Show all of my projects",
  SelectProject: "Select a project",
  // WatchForChanges: "Watch for changes",
  LogOut: "Log out / Quit",
};

async function mainMenu() {
  try {
    const answers = await inquirer.prompt({
      type: "rawlist",
      name: "mainMenu",
      message: "What would you like to do?",
      choices: [...Object.values(Choices), new inquirer.Separator()],
    });

    switch (answers.mainMenu) {
      case Choices.ShowProjects: {
        await projects.getProjects();
        return mainMenu();
      }
      case Choices.SelectProject: {
        return projects.selectProject();
      }
      // case Choices.WatchForChanges: {
      //   await watch.watchForChanges();
      //   output.result(
      //     "We are now watching for changes to the task collection."
      //   );
      //   await ora("Watching (use Ctrl-C to quit)").start();

      //   /* Note: we've implemented this such that the console 
      //       stays open and no further input is possible while
      //       watching for changes. You can open a separate console
      //       to do further work, or you can uncomment the next line
      //       to continue working rather than waiting while watching. 
      //       Changes will still be displayed in the console as they 
      //       occur.
      //       */
      //   // return mainMenu();
      //   break;
      // }
      case Choices.LogOut: {
        const loggedOut = await users.logOut();
        if (!loggedOut) {
          output.error("Error logging out");
        } else output.result("You have been logged out. Use Ctrl-C to quit.");
        return;
      }
      default: {
        return mainMenu();
      }
    }
  } catch (err) {
    output.error(err);
    return;
  }
}


exports.mainMenu = mainMenu;
