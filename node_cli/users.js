const inquirer = require("inquirer");
const Realm = require("realm");
const index = require("./index");
const config = require("./config");
const main = require("./main");

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
      index.output(
        "You have successfully logged in as " + authedUser.id,
        "result"
      );
      return main.mainMenu();
    } else {
      index.output("There was an error logging you in", "error");
      return logIn();
    }
  } catch (err) {
    index.output(JSON.stringify(err, " ", 3), "error");
    return logIn();
  }
}

async function registerUser() {
  index.output("WELCOME NEW USER", "header");
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
    index.output(result, "result");
    const user = await logIn(input.email, input.password);
    if (user) {
      authedUser = user;
      index.output(
        "You have successfully created a new Realm user and are now logged in.",
        "result"
      );
      return main.mainMenu();
    } else {
      index.output(
        "There was an error registering the new user account.",
        "error"
      );
      return registerUser();
    }
  } catch (err) {
    index.output(JSON.stringify(err, " ", 3), "error");
    return registerUser();
  }
}

async function logOut() {
  user = app.currentUser;
  await user.logOut();
  return !user.isLoggedIn;
}

function getAuthedUser() {
  return authedUser;
}

exports.getAuthedUser = getAuthedUser;
exports.logIn = logIn;
exports.logOut = logOut;
exports.registerUser = registerUser;
