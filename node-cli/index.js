const Realm = require("realm");
const inquirer = require("inquirer");
const users = require("./users");
const schemas = require("./schemas");
const output = require("./output");

/*  Change the logLevel to increase or decrease the 
    amount of messages you see in the console.
    Valid options are:
    fatal, error, warn, info, detail, debug, and trace
*/
Realm.Sync.setLogLevel("error");

let realm;
async function openRealm(partitionKey) {
  const config = {
    schema: [schemas.TaskSchema, schemas.UserSchema, schemas.ProjectSchema],
    sync: {
      user: users.getAuthedUser(),
      partitionValue: partitionKey,
    },
  };
  realm = Realm.open(config);
}

output.intro();

async function run() {
  output.header("*** WELCOME ***");
  output.header(
    "Please log in to your Realm account or register as a new user."
  );

  let choice = await inquirer.prompt([
    {
      type: "rawlist",
      name: "start",
      message: "What do you want to do?",
      choices: ["Log in", "Register as a new user"],
    },
  ]);

  if (choice.start === "Log in") {
    users.logIn();
  } else {
    users.registerUser();
  }
}

run().catch((err) => {
  output.error(err.message);
});

async function getRealm(partitionKey) {
  if (realm == undefined) {
    await openRealm(partitionKey);
  }
  return realm;
}

async function closeRealm() {
  if (realm != undefined) {
    realm.close();
    realm = undefined;
  }
}

exports.getRealm = getRealm;
exports.closeRealm = closeRealm;
exports.run = run;
