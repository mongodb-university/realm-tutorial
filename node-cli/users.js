const inquirer = require("inquirer");
const Realm = require("realm");
const index = require("./index");
const main = require("./main");
const output = require("./output");

async function logIn() {
  if (index.app.currentUser != undefined) {
    output.result("You are already logged in as " + index.app.currentUser.id);
    return main.mainMenu();
  }
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
    const user = await index.app.logIn(credentials);
    if (user) {
      output.result(
        "You have successfully logged in as " + index.app.currentUser.id
      );
      return main.mainMenu();
    } else {
      output.error("There was an error logging you in");
      return logIn();
    }
  } catch (err) {
    output.error(JSON.stringify(err, null, 2));
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
    const result = await index.app.emailPasswordAuth.registerUser(
      input.email,
      input.password
    );
    const credentials = Realm.Credentials.emailPassword(
      input.email,
      input.password
    );
    const user = await index.app.logIn(credentials);
    if (user) {
      output.result(
        "You have successfully created a new Realm user and are now logged in."
      );
      return main.mainMenu();
    } else {
      output.error("There was an error registering the new user account.");
      return registerUser();
    }
  } catch (err) {
    output.error(JSON.stringify(err, null, 2));
    return registerUser();
  }
}

async function logOut() {
  user = index.app.currentUser;
  await user.logOut();
  await index.closeRealm();
  return !user.isLoggedIn;
}

function getAuthedUser() {
  return index.app.currentUser;
}

exports.getAuthedUser = getAuthedUser;
exports.logIn = logIn;
exports.logOut = logOut;
exports.registerUser = registerUser;
