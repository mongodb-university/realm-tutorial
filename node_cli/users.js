const inquirer = require("inquirer");
const realmAuth = require("./realm/realmAuth");
const index = require("./index");
const main = require("./main");

async function login() {
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
    const user = await realmAuth.login(input.email, input.password);
    if (user) {
      index.output("You have successfully logged in as " + user.id, "result");
      return main.mainMenu(user);
    } else {
      index.output("There was an error logging you in", "error");
      return login();
    }
  } catch (err) {
    index.output(err, "error");
  }
}

async function register() {
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
    await realmAuth.registerUser(input.email, input.password);
    const user = await realmAuth.login(input.email, input.password);
    if (user) {
      index.output(
        "You have successfully created a new Realm user and are now logged in.",
        "result"
      );
      return main.mainMenu(user);
    } else {
      index.output(
        "There was an error registering the new user account.",
        "error"
      );
      return;
    }
  } catch (err) {
    index.output(err, "error");
  }
}

exports.login = login;
exports.register = register;
