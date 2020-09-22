import React from "react";
import * as Realm from "realm-web";

const RealmAppContext = React.createContext();

export const useRealmApp = () => {
  const app = React.useContext(RealmAppContext);
  if (!app) {
    throw new Error(
      `You must call useRealmApp() inside of a <RealmAppProvider />`
    );
  }
  return app;
};

export const RealmAppProvider = ({ appId, children }) => {
  const [app, setApp] = React.useState(new Realm.App(appId));
  React.useEffect(() => {
    setApp(new Realm.App(appId));
  }, [appId]);
  // Define count and refresh to hack around
  const [currentUser, setCurrentUser] = React.useState(app.currentUser);

  async function logIn(credentials) {
    await app.logIn(credentials);
    setCurrentUser(app.currentUser);
  }
  async function logOut() {
    await app.currentUser?.logOut();
    setCurrentUser(app.currentUser);
  }

  const wrapped = { ...app, currentUser, logIn, logOut };
  return (
    <RealmAppContext.Provider value={wrapped}>
      {children}
    </RealmAppContext.Provider>
  );
};
