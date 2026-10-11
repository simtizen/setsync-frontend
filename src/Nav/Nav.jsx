import React from "react";
import "./Nav.css";

const Nav = ({ currentRoute, onRouteChange, role, handleLogout, usrname, theme, setTheme, belongsToGroup }) => {
    return (
        <nav className="nav-container">
            <h2 className="nav-brand" onClick={() => onRouteChange("home")}>Hello, {usrname}</h2>
            
            <div className="nav-actions">
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
                        onClick={() => onRouteChange("musician-view")}
                        className={`nav-btn ${currentRoute === "musician-view" ? "active" : ""}`}
                    >
                        Musician Hub
                    </button>
                )}
                <button 
                    onClick={() => onRouteChange("members")}
                    className={`nav-btn ${currentRoute === "members" ? "active" : ""}`}
                >
                    Team Members
                </button>

                <button 
                    onClick={handleLogout}
                    className="nav-btn-logout"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Nav;