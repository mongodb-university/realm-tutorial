const inquirer = require("inquirer");
const Realm = require("realm");
const bson = require("bson");
const index = require("./index");
const output = require("./output");
const users = require("./users");
const main = require("./main");

exports.getProjects = async () => {
  const realm = await index.getRealm();
  const currentUser = users.getAuthedUser().id;
  const projects = currentUser.customData.memberOf;
  console.log("The current user is: " + currentUser);
  output.header("MY PROJECTS:");
  output.result(JSON.stringify(projects, null, 2));
  output.err(JSON.stringify(err));
};


const Choices = {
  ShowAllProjects: "Show all of my projects",
  GetProject: "Get a specific project",
  CreateProject: "Create a project",
  DeleteProject: "Change a task status",
  ReturnMainMenu: "Return to main menu",
  LogOut: "Log out / Quit",
};

async function projectMenu() {
  try {
    const answers = await inquirer.prompt({
      type: "rawlist",
      name: "mainMenu",
      message: "What would you like to do?",
      choices: [...Object.values(Choices), new inquirer.Separator()],
    });

    switch (answers.projectMenu) {
      case Choices.ShowAllProjects: {
        await getProjects();
        return projectMenu();
      }
      case Choices.GetProject: {
        await getProject();
        return projectMenu();
      }
      case Choices.CreateProject: {
        await createProject();
        return projectMenu();
      }
      case Choices.DeleteProject: {
        await deleteProject();
        return projectMenu();
      }
      case Choices.ReturnMainMenu: {
        return main.mainMenu();
      }
      case Choices.LogOut: {
        const loggedOut = await users.logOut();
        if (!loggedOut) {
          output.error("Error logging out");
        } else output.result("You have been logged out. Use Ctrl-C to quit.");
        return;
      }
      default: {
        return projectMenu();
      }
    }
  } catch (err) {
    output.error(err);
    return;
  }
}

exports.projectMenu = projectMenu;