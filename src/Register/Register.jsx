import React, { useState } from "react";
import "./Register.css";

const Register = ({ registerUser, onRouteChange }) => {
    const [usrname, setUsrname] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const onSubmit = async (e) => {
        e.preventDefault();

        if (isRegistering) return;

        setIsRegistering(true);

        try {
            await registerUser(usrname, password);
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-heading">Create a SetSync Account</h2>

            <form className="register-form" onSubmit={onSubmit}>
                <input 
                    type="text"
                    placeholder="Username" 
                    value={usrname}
                    onChange={(e) => setUsrname(e.target.value)} 
                    className="register-input"
                />
                
                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="register-input"
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
                    className="register-btn"
                    disabled={isRegistering}
                >
                    {isRegistering ? "Registering..." : "Register"}
                </button>
                <p type="button" onClick={() => onRouteChange("Signin")} className="register-switch">
                    Login instead
                </p>
            </form>
        </div>
    );
}

export default Register;