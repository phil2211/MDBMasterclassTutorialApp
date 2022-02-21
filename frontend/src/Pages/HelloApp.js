import React from "react";
import Button from "@leafygreen-ui/button";
import { useRealmApp } from "../RealmApp";
import Container from "../Components/Container";

const HelloApp = () => {
    const app = useRealmApp();

    return (
        <Container>
            <h1>User: {app.currentUser.id ? `${app.currentUser.id} (${app.currentUser.providerType})` : "not logged in"}</h1>
            <Button variant="primary" onClick={() => app.logOut()}>Logout</Button>
        </Container>
    )
}

export default HelloApp;