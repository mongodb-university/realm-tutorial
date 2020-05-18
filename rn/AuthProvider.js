import React, {useContext, useState} from 'react';
import Realm from 'realm';

const AuthContext = React.createContext(null);

// FIXME: move to its own file
function getApp() {
  const appId = 'myrealmapp-vjmee';
  const appConfig = {
    id: appId,
    url: 'https://realm-dev.mongodb.com', //'http://localhost:8080',
    timeout: 1000,
    app: {
      name: 'default',
      version: '0',
    },
  };
  return new Realm.App(appConfig);
}

const app = getApp();

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const logIn = async (email, password) => {
    try {
      const creds = Realm.Credentials.emailPassword(email, password);
      const newUser = await app.logIn(creds);
      console.log('Logged in with user', newUser.identity);
      console.log('Is logged in?', newUser.isLoggedIn);
      setUser(newUser);
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = () => {
    console.log('Logging out');
    user.logOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error('useAuth() called outside of a AuthProvider?');
  }
  return auth;
};

export {AuthProvider, useAuth};
