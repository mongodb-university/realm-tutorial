import React, {useContext, useState} from 'react';
import Realm from 'realm';
import {getRealmApp} from '../getRealmApp';

// Access the Realm App.
const app = getRealmApp();

// Create a new Context object that will be provided to descendants of the AuthProvider.
const AuthContext = React.createContext(null);

const AuthProvider = ({children}) => {
  const signIn = async (email, password) => {
    try {
      const credentials = Realm.Credentials.emailPassword(email, password);
      const user = await app.logIn(credentials);
      const userRealmConfig = {
        sync: {
          user: user,
          partitionValue: `user=${user.id}`,
        },
      };
      const userRealm = await Realm.open(userRealmConfig);
      return userRealm;
    } catch (err) {
      throw 'Error signing in' + err;
    }
  };
  const signUp = async (email, password) => {
    try {
      await app.emailPasswordAuth.registerUser(email, password);
      return await signIn(email, password);
    } catch (err) {
      throw 'Error signing up ' + JSON.stringify(err, null, 2);
    }
  };
  const logOut = () => null;
  let user = null;
  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
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
