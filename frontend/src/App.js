import React from "react";
import { RealmAppProvider } from "./RealmApp";

const APP_ID = process.env.REACT_APP_REALMAPP;
console.log(process.env.REACT_APP_REALMAPP);

const App = () => {
  return (
    <RealmAppProvider appId={APP_ID}>
      <h1>Hello Realm App</h1>
    </RealmAppProvider>
    
  );
}

export default App;