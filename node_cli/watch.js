const chalk = require("chalk");
const realmTasks = require("./realm/realmTasks");
const { cyan } = require("chalk");

function listener(tasks, changes) {
  changes.deletions.forEach((index) => {
    // Deleted objects cannot be accessed directly,
    // but we can update a UI list, etc. knowing the index.
    logIt("A task has been deleted", "");
  });

  changes.insertions.forEach((index) => {
    let insertedTask = tasks[index];
    logIt("Task Inserted", JSON.stringify(insertedTask, " ", 3));
  });

  changes.modifications.forEach((index) => {
    let modifiedTask = tasks[index];
    logIt("Task Modified", JSON.stringify(modifiedTask, " ", 3));
  });
}

function logIt(header, text) {
  console.log(
    chalk.bgCyan.black("\n---------------" + header + "----------------\n")
  );
  console.log(chalk.cyanBright(text + "\n"));
}

async function watchForChanges(user) {
  const realm = await realmTasks.openRealm(user);
  const tasks = await realm.objects("Task");
  tasks.addListener(listener);
}

module.exports.watchForChanges = watchForChanges;
