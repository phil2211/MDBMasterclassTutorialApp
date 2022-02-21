import React from "react";
import * as Realm from "realm-web";

const RealmAppContext = React.createContext();

export const RealmAppProvider = ({ appId, children}) => {
    const [app, setApp] = React.useState(new Realm.App(appId));
    React.useEffect(() => {
        setApp(new Realm.App(appId));
    }, [appId]);  

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
}