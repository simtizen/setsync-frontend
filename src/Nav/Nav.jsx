import React, { useState } from "react";
import "./Nav.css";

const Nav = ({ currentRoute, onRouteChange, role, handleLogout, usrname, theme, setTheme, belongsToGroup }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigate = (route) => {
        onRouteChange(route);
        setIsMenuOpen(false);
    };

    const handleLogoutClick = () => {
        setIsMenuOpen(false);
        handleLogout();
    };

    return (
        <nav className="nav-container">
            <h2 className="nav-brand" onClick={() => handleNavigate("home")}>Hello, {usrname}</h2>

            <button 
                type="button"
                className="nav-toggle" 
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
            >
                {isMenuOpen ? "✕" : "☰"}
            </button>

            <div className={`nav-actions ${isMenuOpen ? "open" : ""}`}>
                <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    className="nav-select"
                >
                    <option value="slate-light">Stage Slate (Light)</option>
                    <option value="slate-dark">Stage Slate (Dark)</option>
                    <option value="obsidian-light">Obsidian (Light)</option>
                    <option value="obsidian-dark">Obsidian (Dark)</option>
                    <option value="indigo-light">Velvet Indigo (Light)</option>
                    <option value="indigo-dark">Velvet Indigo (Dark)</option>
                </select>

                {belongsToGroup && (
                    <button 
                        onClick={() => handleNavigate("upcoming-setlists")}
                        className={`nav-btn ${currentRoute === "upcoming-setlists" ? "active" : ""}`}
                    >
                        Upcoming Setlists
                    </button>
                )}
                <button 
                    onClick={() => handleNavigate("members")}
                    className={`nav-btn ${currentRoute === "members" ? "active" : ""}`}
                >
                    Team Members
                </button>

                <button 
                    onClick={handleLogoutClick}
                    className="nav-btn-logout"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Nav;