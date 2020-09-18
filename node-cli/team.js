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
  let member;
  try {
    output.header("*** ADD A TEAM MEMBER ***");
    currentUser = users.getAuthedUser();
    member = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "What is the new team member's email address?",
      },
    ]);
    let result = await currentUser.callFunction("addTeamMember", [member.email]);
    output.result("The user was added to your team.");
  } catch (err) {
    output.error(`No user exists with the email ${member.email}`);
  }
};

exports.removeTeamMember = async () => {
  const user = users.getAuthedUser();
  const teamMembers = await user.functions.getMyTeamMembers();
  const teamMemberNames = teamMembers.map(t => t.name);
  try {
    output.header("*** REMOVE A TEAM MEMBER ***");
    const { selectedTeamMember } = await inquirer.prompt([
      {
        type: "rawlist",
        name: "selectedTeamMember",
        message: "Which team member do you want to remove?",
        choices: [...teamMemberNames, new inquirer.Separator()],
      },
    ]);
    let result = await user.callFunction("removeTeamMember", [selectedTeamMember]);
    output.result("The user was removed from your team.");
  } catch (err) {
    output.error(JSON.stringify(err));
  }
};
