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

authedUser = {};

async function logIn() {
  const input = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Email:",
    },
    {
      type: "password",
      name: "password",
      message: "Password:",
      mask: "*",
    },
  ]);

  try {
    const credentials = Realm.Credentials.emailPassword(
      input.email,
      input.password
    );
    const user = await app.logIn(credentials);
    if (user) {
      authedUser = user;
      output.result("You have successfully logged in as " + authedUser.id);
      return main.mainMenu();
    } else {
      output.error("There was an error logging you in");
      return logIn();
    }
  } catch (err) {
    output.error(JSON.stringify(err, " ", 3));
    return logIn();
  }
}

async function registerUser() {
  output.header("WELCOME, NEW USER");
  const input = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Email:",
    },
    {
      type: "password",
      name: "password",
      message: "Password:",
      mask: "*",
    },
  ]);

  try {
    const result = await app.emailPasswordAuth.registerUser(
      input.email,
      input.password
    );
    output.result(result);
    const user = await logIn(input.email, input.password);
    if (user) {
      authedUser = user;
      output.result(
        "You have successfully created a new Realm user and are now logged in."
      );
      return main.mainMenu();
    } else {
      output.error("There was an error registering the new user account.");
      return registerUser();
    }
  } catch (err) {
    output.error(JSON.stringify(err, " ", 3));
    return registerUser();
  }
}

async function logOut() {
  user = app.currentUser;
  await user.logOut();
  await index.closeRealm();
  return !user.isLoggedIn;
}

function getAuthedUser() {
  return authedUser;
}

exports.getAuthedUser = getAuthedUser;
exports.logIn = logIn;
exports.logOut = logOut;
exports.registerUser = registerUser;
