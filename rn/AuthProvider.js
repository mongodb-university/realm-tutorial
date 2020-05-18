import React, {useContext, useState, useEffect} from 'react';

const AuthContext = React.createContext();

const AuthProvider = ({children}) => {
  return (
    <AuthContext.Provider
      value={{
        foo: 'It works',
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth === undefined) {
    throw new Error('useAuth() called outside of a AuthProvider?');
  }
  return auth;
};

export {AuthProvider, useAuth};
