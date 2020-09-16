const inquirer = require("inquirer");
const Realm = require("realm");
const bson = require("bson");
const index = require("./index");
const output = require("./output");
const users = require("./users");
const main = require("./main");
const team = require("./team");

exports.getProjects = async () => {
  const realm = await index.getRealm(`user=${users.getAuthedUser().id}`);
  const currentUser = users.getAuthedUser().id;
  const user = realm.objectForPrimaryKey("User", currentUser);
  const projects = user.memberOf;
  output.header("MY PROJECTS:");
  output.result(JSON.stringify(projects, null, 2));
};
