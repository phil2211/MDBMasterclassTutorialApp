import React from "react";
import * as Realm from "realm-web";
import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import Button from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { useMsal } from "@azure/msal-react";
import { GoogleLoginButton, MicrosoftLoginButton } from "react-social-login-buttons";

import { useRealmApp } from "../RealmApp";
import Container from "../Components/Container";
import Loading from "../Components/Loading";



const LoginScreen = () => {
    const app = useRealmApp();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState({});
    const [isLoggingIn, setIsLoggingIn] = React.useState(false);
    const { instance, accounts } = useMsal();

    const handleLogin = async () => {
        setIsLoggingIn(true);
        setError((e) => ({ ...e, password: null }));
        try {
            await app.logIn(Realm.Credentials.emailPassword(email, password));
        } catch (err) {
            handleAuthenticationError(err, setError)
            setIsLoggingIn(false);
        }
    }
    
    const handleSSOLogin = async () => {
        try {
            //setIsLoggingIn(true);

            let jwt = await instance.acquireTokenPopup({
                scopes: [`${process.env.REACT_APP_APPID}/.default`],
                account: accounts[0]
            });
    
            jwt = await JSON.stringify(jwt.accessToken).slice(1,-1);
            await app.logInJwt(jwt);
        } catch (err) {
            console.log(err);
            handleAuthenticationError(err, setError);
        }
    }

    const handleSSOGoogleLogin = async () => {
        try {
            await app.logInGoogle();
        } catch (err) {
            console.log(err);
            handleAuthenticationError(err, setError);
        }
    }

    const handleAuthenticationError = (err, setError) => {
        const { status, message } = parseAuthenticationError(err);
        const errorType = message || status;
        console.log(errorType);
        switch (errorType) {
            case "invalid username":
                setError((prevErr) => ({ ...prevErr, email: "Invalid email address"}));
                break;
            case "invalid username/password":
            case "invalid password":
            case "401":
                setError((err) => ({ ...err, password: "Incorrect password"}));
                break;
            default:
                break;
        }
    }

    return (
        <Container>
            {isLoggingIn ? (
                <Loading />
            ) : (
                <>
                <LoginFormRow>
                    <LoginHeading>Please identify</LoginHeading>
                </LoginFormRow>
                <LoginFormRow>
                    <TextInput 
                        type="email" 
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        errorMessage={error.email}
                        state={error.email ? "error" : "none"}
                    />
                </LoginFormRow>
                <LoginFormRow>
                    <TextInput 
                        type="password" 
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        errorMessage={error.password}
                        state={error.password ? "error" : "none" }
                    />
                </LoginFormRow> 
                <LoginFormRow>
                    <Button variant="primary" onClick={() => handleLogin()}>Login</Button>
                </LoginFormRow>           
                <LoginFormRow>
                    <MicrosoftLoginButton onClick={() => handleSSOLogin()} />
                </LoginFormRow>
                <LoginFormRow>
                    <GoogleLoginButton onClick={() => handleSSOGoogleLogin()} />
                </LoginFormRow>
                </>
            )}
        </Container>
    )
}

export default LoginScreen;

function parseAuthenticationError(err) {
    const parts = err.message.split(":");
    const reason = parts[parts.length - 1].trimStart();
    if (!reason) return { status: "", message: "" };
    const reasonRegex = /(?<message>.+)\s\(status (?<status>[0-9][0-9][0-9])/;
    const match = reason.match(reasonRegex);
    const { status, message } = match?.groups ?? {};
    return { status, message };
}

const LoginHeading = styled.h1`
  margin: 0;
  font-size: 32px;
`;

const LoginFormRow = styled.div`
  margin-bottom: 16px;
`;