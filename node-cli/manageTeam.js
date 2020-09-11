const inquirer = require("inquirer");
const Realm = require("realm");
const index = require("./index");
const config = require("./config");
const main = require("./main");
const output = require("./output");


const REALM_APP_ID = config.realmAppId;
const appConfig = {
  id: REALM_APP_ID,
  timeout: 10000,
};

const app = new Realm.App(appConfig);
const user = app.currentUser;

exports.getTeam = async () => {
  const realm = await index.getRealm();
  try {
    const teamMembers = await user.functions.getMyTeamMembers([]);
    output.result(JSON.stringify(tasks, null, 2));
  }
  catch (err) {
    output.error(JSON.stringify(err));
  }
};  

exports.addTeamMember = async () => {
  const realm = await index.getRealm();
  try {
    output.header("*** ADD A TEAM MEMBER ***");
    const newMember = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "What is the new member's email address?",
      },
    ]);
    let result = await user.functions.addTeamMember(input.email);
    output.result("The user was added to your team.");
    output.result(result);
  } catch (err) {
    output.error(JSON.stringify(err));
  }
};

// exports.removeTeamMember = async () => {
//   const realm = await index.getRealm();
//   try {
//     output.header("*** REMOVE A TEAM MEMBER ***");
//     const remove
//   }
// }