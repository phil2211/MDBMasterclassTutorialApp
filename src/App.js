import React from "react";
import { RealmAppProvider, useRealmApp } from "./RealmApp";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import LoginScreen from "./Containers/LoginScreen";
import GoogleLogin from "./Containers/GoogleLogin";
import Grid from "./Containers/Grid";
import { msalConfig } from "./lib/azure/authConfig";
import RealmApolloProvider from "./lib/graphql/apolloClient";

const APP_ID = process.env.REACT_APP_REALMAPP;
const msalInstance = new PublicClientApplication(msalConfig);

const RequireLoggedInUser = ({ children }) => {
  // Only render children if there is a logged in user.
  const app = useRealmApp();
  return app.currentUser ? children : <LoginScreen />;
};

const App = () => {
  return (
    <RealmAppProvider appId={APP_ID}>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter>
            <Routes>
            <Route path="/google_login" element={<GoogleLogin />} />
            <Route path="/" element={
              <RequireLoggedInUser>
                <RealmApolloProvider>
                  <Grid />
              </RealmApolloProvider>
            </RequireLoggedInUser>
            } />
          </Routes>
        </BrowserRouter>
      </MsalProvider>
    </RealmAppProvider>

  )
}

export default App;