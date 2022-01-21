import React from "react";
import * as Realm from "realm-web";

const RealmAppContext = React.createContext();

export const useRealmApp = () => {
    const app = React.useContext(RealmAppContext);
    if (!app) {
        throw new Error (
            `You must call useRealmApp() inside of a <RealmAppProvider />`
        );
    }
    return app;
}

export const RealmAppProvider = ({ appId, children }) => {
    const [app, setApp] = React.useState(new Realm.App(appId));
    React.useEffect(() => {
        setApp(new Realm.App(appId));
    }, [appId]);

    // Wrap the Realm.App object's user state with React state
    const [currentUser, setCurrentUser] = React.useState(app.currentUser);

    async function logInJwt(credentials) {
        const jwt = Realm.Credentials.jwt(credentials);
        await app.logIn(jwt);
        // If successful, app.currentUser is the user that just logged in
        setCurrentUser(app.currentUser);
    }

    async function logInGoogle() {
        await app.logIn(Realm.Credentials.google(`${process.env.REACT_APP_REDIRECT}/google_login`));
        setCurrentUser(app.currentUser);
    }

    async function logIn(credentials) {
        await app.logIn(credentials);
        // If successful, app.currentUser is the user that just logged in
        setCurrentUser(app.currentUser);
    }

    async function logOut() {
        // Log out the currrently active user
        await app.currentUser?.logOut();
        // If another user was logged in too, they're now the current user.
        // Otherwise, app.currentUser is null.
        setCurrentUser(app.currentUser);
    }

    const wrapped = { ...app, currentUser, logIn, logInJwt, logInGoogle, logOut };

    return (
        <RealmAppContext.Provider value={wrapped}>
            {children}
        </RealmAppContext.Provider>
    );
};