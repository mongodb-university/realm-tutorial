const inquirer = require("inquirer");
const Realm = require("realm");
const index = require("./index");
const main = require("./main");
const output = require("./output");
const users = require("./users");
const team = require("./team");


const Choices = {
    GetTeamMembers: "Get my team members",
    AddTeamMember: "Add a team member",
    RemoveTeamMember: "Remove a team member",
    MainMenu: "Return to main menu",
    LogOut: "Log out / Quit",
  };
  
  async function manageTeamMenu() {
    try {
      const answers = await inquirer.prompt({
        type: "rawlist",
        name: "manageTeamMenu",
        message: "What would you like to do?",
        choices: [...Object.values(Choices), new inquirer.Separator()],
      });
  
      switch (answers.manageTeamMenu) {
        case Choices.GetTeamMembers: {
          await team.getTeamMembers();
          return manageTeamMenu();
        }
        case Choices.AddTeamMember: {
          await team.addTeamMember();
          return manageTeamMenu();
        }
        case Choices.RemoveTeamMember: {
          await team.removeTeamMember();
          return manageTeamMenu();
        }
        case Choices.MainMenu: {
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
          return manageTeamMenu();
        }
      }
    } catch (err) {
      output.error(err);
      return;
    }
  };
  
  exports.manageTeamMenu = manageTeamMenu;
  
  