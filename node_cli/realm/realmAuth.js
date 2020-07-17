const Realm = require("realm");
const index = require("../index");
const config = require("../config");

const REALM_APP_ID = config.realmAppId;
const appConfig = {
  id: REALM_APP_ID,
  timeout: 10000,
};

const app = new Realm.App(appConfig);

async function login(email, password) {
  const credentials = Realm.Credentials.emailPassword(email, password);
  try {
    const user = await app.logIn(credentials);
    return user;
  } catch (e) {
    index.output(e.message, "error");
    return false;
  }
}

async function registerUser(email, password) {
  console.log("oh hai", email, password);
  const result = await app.emailPasswordAuth.registerUser(email, password);
  index.output(result, "result");
  return;
}

async function logout() {
  user = app.currentUser;
  await user.logOut();
  return !user.isLoggedIn;
}

module.exports.logout = logout;
module.exports.login = login;
module.exports.registerUser = registerUser;
