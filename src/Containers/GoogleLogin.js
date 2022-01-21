import React, { useEffect } from "react";
import { handleAuthRedirect } from "realm-web";

const GoogleLogin = () => {
    useEffect(() => {
        handleAuthRedirect();
    })
    return (
        <h1>Signing in... Please Wait</h1>
    )
}

export default GoogleLogin;