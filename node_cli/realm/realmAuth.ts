import {Command, flags} from '@oclif/command'
import {Realm} from 'realm';

const REALM_APP_ID = "realmtutorials-dcyrc";
const appConfig = {
   id: REALM_APP_ID,
   timeout: 10000,
 };
 const keyFileName = 'realmUserAPI.key';

 const app = new Realm.App(appConfig);

 console.log('app', app.auth);

export async function login(email, password) {
    const credentials = Realm.Credentials.emailPassword(email, password);
    try{
      return await app.logIn(credentials).then(async user =>{
          console.log('u', user)
          console.log('user', user.isLoggedIn, user.identity);
          return user;
      })
    }
    catch(e){
      console.log(e)
      if (e.message == 'invalid username/password'){
        return await app.auth.emailPassword.registerUser(email, password)
        .then(async u =>{
          console.log('u', u)
          console.log('user', u.isLoggedIn, u.identity);
          return u;
      })
      }
    }
  }

export async function logout() {
  //TODO: delete or disable the API key until the next logon
  //await app.auth.apiKey.disable(keyId);
  //or
  //await app.auth.apiKey.delete(keyId);
  user = app.currentUser;
  console.log(user?.identity)
  if (user?.identity !== undefined) user.logOut();

  fs.writeFile(keyFileName, "", function (err) {
    console.log(err)
  });

  return true;
}