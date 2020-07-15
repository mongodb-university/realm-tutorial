var Realm = require("realm");

const REALM_APP_ID = "realmtutorials-dcyrc";
const appConfig = {
  id: REALM_APP_ID,
  timeout: 10000,
};

const app = new Realm.App(appConfig);

let user;

async function login(email, password) {
  const credentials = Realm.Credentials.emailPassword(email, password);
  try {
    return await app.logIn(credentials).then(async (u) => {
      user = u;
      return user;
    });
  } catch (e) {
    console.log(e);

    //TODO: how to handle bad password vs. register new user
    // also: registerUser is not valid
    if (e.message == "invalid username/password") {
      return await app.auth.emailPassword
        .registerUser(email, password)
        .then(async (u) => {
          return u;
        });
    }
  }
}

async function logout() {
  user = app.currentUser;
  if (user.identity !== undefined) user.logOut();
  return !user.isLoggedIn;
}

module.exports.logout = logout;
module.exports.login = login;
module.exports.user = user;
