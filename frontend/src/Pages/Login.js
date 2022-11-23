import React from "react";
import * as Realm from "realm-web";
import Container from "../Components/Container";
import FormRow from "../Components/FormRow";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import { useRealmApp } from "../RealmApp";

const Login = () => {
    const app = useRealmApp();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = async () => {
        try {
            await app.logIn(Realm.Credentials.emailPassword(email, password));
            //await app.logIn(Realm.Credentials.function({ "foo": "bar"}));
            //await app.logIn(Realm.Credentials.anonymous());
        } catch (e) {
            console.error("error loggin in");
        }
    } 

    return (
        <Container>
            <h1>Bitte einloggen</h1>
            <FormRow>
                <TextInput
                    type="email"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </FormRow>
            <FormRow>
                <TextInput
                    type="password"
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </FormRow>
            <Button variant="primary" onClick={handleLogin}>Login</Button>
        </Container>
    )
}

export default Login;