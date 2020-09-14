const inquirer = require("inquirer");
const Realm = require("realm");
const index = require("./index");
const config = require("./config");
const main = require("./main");
const output = require("./output");
const users = require("./users");
const tasks = require("./tasks");


exports.getTeamMembers = async () => {
  const realm = await index.getRealm();
  const user = users.getAuthedUser();
  console.log(user.callFunction("getMyTeamMembers"));
  try {
    const teamMembers = await user.callFunction("getMyTeamMembers");
    output.result(JSON.stringify(teamMembers, null, 2));
  }
  catch (err) {
    output.error(JSON.stringify(err));
  }
};  

exports.addTeamMember = async () => {
  const realm = await index.getRealm();
  try {
    output.header("*** ADD A TEAM MEMBER ***");
    const member = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "What is the new member's email address?",
      },
    ]);
    let result = await users.getAuthedUser().callFunction("addTeamMember", [member.email]);
    output.result("The user was added to your team.");
    output.result(result);
  } catch (err) {
    output.error(JSON.stringify(err));
  }
};

exports.removeTeamMember = async () => {
  const realm = await index.getRealm();
  try {
    output.header("*** REMOVE A TEAM MEMBER ***");
    const member = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "Enter the email address of the member you want to remove:",
      },
    ]);
    let result = await users.getAuthedUser().callFunction("removeTeamMember", member.email);
    output.result("The user was removed from your team.");
    output.result(result);
  } catch (err) {
    output.error(JSON.stringify(err));
  }
};

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
      name: "mainMenu",
      message: "What would you like to do?",
      choices: [...Object.values(Choices), new inquirer.Separator()],
    });

    switch (answers.manageTeamMenu) {
      case Choices.GetTeamMembers: {
        await getTeamMembers();
        return manageTeamMenu();
      }
      case Choices.AddTeamMember: {
        await addTeamMember();
        return manageTeamMenu();
      }
      case Choices.RemoveTeamMember: {
        await removeTeamMember();
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

