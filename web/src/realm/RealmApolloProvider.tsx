import * as React from "react";
import * as Realm from "realm-web";
import { useRealmApp } from "./RealmApp";

// Apollo
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { NormalizedCacheObject } from "@apollo/client/cache";

const RealmApolloProvider: React.FC = ({ children }) => {
  const { id, user } = useRealmApp();
  const [client, setClient] = React.useState(
    createApolloClient(id, user as Realm.User)
  );
  React.useEffect(() => {
    setClient(createApolloClient(id, user as Realm.User));
  }, [id, user]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default RealmApolloProvider;

// TODO: Implement createApolloClient()
function createApolloClient(realmAppId: string, user: Realm.User) {
  
}
