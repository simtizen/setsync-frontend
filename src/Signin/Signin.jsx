import React, { useState } from "react";
import "./Signin.css"

const Signin = ({ signinUser, onRouteChange }) => {
    const [usrname, setUsrname] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        signinUser(usrname, password);
    }

    return (
        <div className="signin-container">
            <h2 className="signin-heading">Login to your SetSync account</h2>
            {message && <p className="signin-message">{message}</p>}

            <form className="signin-form" onSubmit={onSubmit}>
                <input 
                    type="text"
                    placeholder="Username"
                    value={usrname}
                    onChange={e => setUsrname(e.target.value)}
                    className="signin-input"
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="signin-input"
                />
                <button type="submit" className="signin-btn">Login</button>
                <p type="button" onClick={() => onRouteChange("Register")} className="signin-switch">
                    Register Instead
                </p>
            </form>
        </div>
    );
}

export default Signin;