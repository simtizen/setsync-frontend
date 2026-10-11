import React, { useState } from "react";
import "./Register.css";

const Register = ({ registerUser, onRouteChange }) => {
    const [usrname, setUsrname] = useState('');
    const [password, setPassword] = useState('');
    
    const onSubmit = (e) => {
        e.preventDefault();
        
        // Call the function passed down from App.jsx!
        registerUser(usrname, password);
    };

    return (
        <div className="register-container">
            <h2 className="register-heading">Create SetSync Account</h2>

            <form className="register-form" onSubmit={onSubmit}>
                <input 
                    type="text"
                    placeholder="Username" 
                    value={usrname}
                    onChange={(e) => setUsrname(e.target.value)} 
                    className="register-input"
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                />
                <button type="submit" className="register-btn">Register</button>
                <p type="button" onClick={() => onRouteChange("Signin")} className="register-switch">
                    Login instead
                </p>
            </form>
        </div>
    );
}

export default Register;