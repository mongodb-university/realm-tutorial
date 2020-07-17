const Realm = require("realm");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const users = require("./users");
const main = require("./main");

/* Change the logLevel to increase or decrease console "noise"
Options are:
fatal, error, warn, info, detail, debug, and trace
*/
Realm.Sync.setLogLevel("error");

const output = (text, type) => {
  if (type == "result") console.log(chalk.yellowBright(text + "\n"));
  if (type == "header") console.log(chalk.cyanBright.bold("\n" + text + "\n"));
  if (type == "error") console.log(chalk.red.bold("\n ❗" + text + " ❗\n"));
};

clear();
console.log(
  chalk.green.bold(
    figlet.textSync("Realm Tasks", {
      font: "colossal",
    })
  )
);

async function run() {
  output("*** WELCOME ***", "header");
  output(
    "Please log in to your Realm account or register as a new user.",
    "header"
  );

  let choice = await inquirer.prompt([
    {
      type: "rawlist",
      name: "start",
      message: "What do you want to do?",
      choices: ["Log in", "Register as a new user"],
    },
  ]);

  if (choice.start == "Log in") {
    users.login();
  } else {
    users.register();
  }
}

run().catch((err) => {
  output(err, "error");
});

exports.output = output;
