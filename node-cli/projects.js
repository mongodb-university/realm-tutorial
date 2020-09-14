const inquirer = require("inquirer");
const Realm = require("realm");
const bson = require("bson");
const index = require("./index");
const output = require("./output");
const users = require("./users");
const main = require("./main");
const team = require("./team");

exports.getProjects = async () => {
  const realm = await index.getRealm(`user=${users.getAuthedUser().id}`);
  const currentUser = users.getAuthedUser().id;
  output.result("the current user is:" + currentUser);
  const projects = currentUser.customData.memberOf;
  output.header("MY PROJECTS:");
  output.result(JSON.stringify(projects, null, 2));
};


const Choices = {
  ShowAllProjects: "Show all of my projects",
  ManageTeam: "Manage my team",
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
      case Choices.ManageTeam: {
        return team.manageTeamMenu();
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