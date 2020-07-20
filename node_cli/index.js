const Realm = require("realm");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const users = require("./users");

/*  Change the logLevel to increase or decrease the 
    amount of messages you see in the console.
    Valid options are:
    fatal, error, warn, info, detail, debug, and trace
*/
Realm.Sync.setLogLevel("error");

const output = (text, type) => {
  switch (type) {
    case "header": {
      console.log(chalk.cyanBright.bold("\n" + text + "\n"));
      break;
    }
    case "error": {
      console.log(chalk.red.bold("\n ❗\n" + text + "\n ❗\n"));
      break;
    }
    case "header":
    default: {
      console.log(chalk.yellowBright(text + "\n"));
    }
  }
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
    users.logIn();
  } else {
    users.registerUser();
  }
}

run().catch((err) => {
  output(err.message, "error");
});

exports.output = output;
exports.run = run;
