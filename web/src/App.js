import React from "react";
import LoginScreen from "./components/LoginScreen";
import TaskApp from "./TaskApp";
import RealmApolloProvider from "./graphql/RealmApolloProvider";
import { useRealmApp, RealmAppProvider } from "./RealmApp";

export const APP_ID = "tasktracker-huhcb";

const LoggedIn = ({ children }) => {
  // Only render children if there is a logged in user.
  const {app} = useRealmApp();
  return app.currentUser ? children : null;
};

const LoggedOut = ({ children }) => {
  // Only render children if there is not a logged in user.
  const {app} = useRealmApp();
  return app.currentUser ? null : children;
};

export default function App() {
  return (
    <RealmAppProvider appId={APP_ID}>
      <LoggedIn>
        <RealmApolloProvider>
          <TaskApp />
        </RealmApolloProvider>
      </LoggedIn>
      <LoggedOut>
        <LoginScreen />
      </LoggedOut>
    </RealmAppProvider>
  );
}
