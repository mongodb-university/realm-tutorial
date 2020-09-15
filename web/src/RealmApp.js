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
  const [count, setCount] = React.useState(0);
  function refresh() {
    setCount(c => c + 1);
  }
  return (
    <RealmAppContext.Provider value={{app, refresh, count}}>{children}</RealmAppContext.Provider>
  );
};
