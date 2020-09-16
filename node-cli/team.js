const inquirer = require("inquirer");
const Realm = require("realm");
const output = require("./output");
const users = require("./users");


exports.getTeamMembers = async () => {
  const user = users.getAuthedUser();
  try {
    const teamMembers = await user.functions.getMyTeamMembers();
    output.result(JSON.stringify(teamMembers, null, 2));
  }
  catch (err) {
    output.error(JSON.stringify(err));
  }
};  

exports.addTeamMember = async () => {
  let currentUser;
  try {
    output.header("*** ADD A TEAM MEMBER ***");
    currentUser = users.getAuthedUser();
    const member = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "What is the new team member's email address?",
      },
    ]);
    let result = await currentUser.callFunction("addTeamMember", [member.email]);
    output.result("The user was added to your team.");
    output.result(result);
  } catch (err) {
    output.error(JSON.stringify(err));
  }
};

exports.removeTeamMember = async () => {
  try {
    output.header("*** REMOVE A TEAM MEMBER ***");
    const member = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "Enter the email address of the member you want to remove:",
      },
    ]);
    let result = await users.getAuthedUser().callFunction("removeTeamMember", [member.email]);
    output.result("The user was removed from your team.");
    output.result(result);
  } catch (err) {
    output.error(JSON.stringify(err));
  }
};

