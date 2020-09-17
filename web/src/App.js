import React from "react";
import LoginScreen from "./components/LoginScreen";
import TaskApp from "./TaskApp";
import RealmApolloProvider from "./graphql/RealmApolloProvider";
import { useRealmApp, RealmAppProvider } from "./RealmApp";

export const APP_ID = "tasktracker-huhcb";

export default function App() {
  const {app} = useRealmApp();
  return (
    <RealmAppProvider appId={APP_ID}>
      {app.currentUser ? (
        <RealmApolloProvider>
          <TaskApp />
        </RealmApolloProvider>
      ) : (
        <LoginScreen />
      )}
    </RealmAppProvider>
  );
}
