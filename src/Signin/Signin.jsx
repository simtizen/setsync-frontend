import React, { useState } from "react";
import "./Signin.css"

const Signin = ({ signinUser, onRouteChange }) => {
    const [usrname, setUsrname] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (isLoggingIn) return;

        setIsLoggingIn(true);

        try {
            await signinUser(usrname, password);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="signin-container">
            <h2 className="signin-heading">Login to your SetSync account</h2>

            <form className="signin-form" onSubmit={onSubmit}>
                <input 
                    type="text"
                    placeholder="Username"
                    value={usrname}
                    onChange={e => setUsrname(e.target.value)}
                    className="signin-input"
                />

                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="signin-input"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="show-password-btn"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                
                <button
                    type="submit"
                    className="signin-btn"
                    disabled={isLoggingIn}
                >
                {isLoggingIn ? "Logging in..." : "Login"}
                </button>
                <p type="button" onClick={() => onRouteChange("Register")} className="signin-switch">
                    Register Instead
                </p>
            </form>
        </div>
    );
}

export default Signin;