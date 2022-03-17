import React from "react";
import { RealmAppProvider, useRealmApp } from "./RealmApp";
import Grid from "./Pages/Grid";
import Login from "./Pages/Login";
import RealmApolloProvider from "./lib/graphql/apolloClient";

const APP_ID = process.env.REACT_APP_REALMAPP;

const RequireLoggedInUser = ({ children }) => {
  const app = useRealmApp();
  return app.currentUser ? children : <Login />;
};

const App = () => {
  return (
    <RealmAppProvider appId={APP_ID}>
      <RequireLoggedInUser>
        <RealmApolloProvider>
          <Grid />
        </RealmApolloProvider>
      </RequireLoggedInUser>
    </RealmAppProvider>
    
  );
}

export default App;