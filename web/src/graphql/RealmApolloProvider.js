import React from "react";
import { useRealmApp } from "../RealmApp";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const createRealmApolloClient = (app) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: `https://realm.mongodb.com/api/client/v2.0/app/${app.id}/graphql`,
      fetch: async (uri, options) => {
        if (!app.currentUser) {
          throw new Error(`Must be logged in to use the GraphQL API`);
        }
        await app.currentUser.refreshCustomData();
        options.headers.Authorization = `Bearer ${app.currentUser.accessToken}`;
        return fetch(uri, options);
      },
    }),
    cache: new InMemoryCache(),
  });
};

export default function RealmApolloProvider({ children }) {
  const { app } = useRealmApp();
  const [client, setClient] = React.useState(createRealmApolloClient(app));
  React.useEffect(() => {
    setClient(createRealmApolloClient(app));
  }, [app]);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
