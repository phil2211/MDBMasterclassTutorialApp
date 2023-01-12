import React from "react";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { useRealmApp } from "../../RealmApp";

const createRealmApolloClient = (app) => {
    const link = new HttpLink({
        uri: `https://eu-central-1.aws.realm.mongodb.com/api/client/v2.0/app/${app.id}/graphql`,
        fetch: async (uri, options) => {
            if (!app.currentUser) {
                throw new Error("Must be logged in to use the GraphQL API");
            }
            await app.currentUser.refreshCustomData();
            options.headers.Authorization = `Bearer ${app.currentUser.accessToken}`;
            return fetch(uri, options);
        }
    });

    const defaultOptions = {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      }

    const cache = new InMemoryCache();
    return new ApolloClient({ link, cache, defaultOptions });
}

const RealmApolloProvider = ({ children }) => {
    const app = useRealmApp();
    const [client, setClient] = React.useState(createRealmApolloClient(app));

    React.useEffect(() => {
        setClient(createRealmApolloClient(app));
    }, [app]);

    return <ApolloProvider client={client}>{ children }</ApolloProvider>
}

export default RealmApolloProvider;