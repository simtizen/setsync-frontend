import React, { useState } from "react";
import axios from "axios";
import "./Onboard.css";

const Onboard = ({route, onRouteChange, refreshProfile, url}) => {
    const [groupName, setGroupName] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    const createGroup = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        try {
            const response = await axios.post(`${url}/create-group`, {
                name: groupName
            }, 
            {
                headers: {'Authorization': `Bearer ${token}`}
            });

            alert(response.data.msg);
            await refreshProfile();
            onRouteChange("home");
        } catch (err) {
            const backendError = err.response?.data?.error || "Error Creating Group";
            alert(backendError);
        }
    }

    const joinGroup = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        try {
            const response = await axios.post(`${url}/join-group`, {
                inviteCode: inviteCode
            }, 
            {
                headers: {'Authorization': `Bearer ${token}`}
            });

            alert(response.data.msg);
            await refreshProfile();
            onRouteChange("home");
        } catch (err) {
            const backendError = err.response?.data?.error || "Error Joining Group";
            alert(backendError);
        }
    }

    return (
        <div className="onboard-container">
            {route === 'create-group' ? (
                <div className="onboard-card">
                    <h2 className="onboard-title">Create a New Group</h2>
                    <form className="onboard-form" onSubmit={createGroup}>
                        <input 
                            type="text" 
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="onboard-input"
                        />
                        <button type="submit" className="onboard-btn">Create Group</button>
                    </form>
                    <p onClick={() => onRouteChange("home")} className="onboard-back">Back</p>
                </div>
            ) : route === 'join-group' ? (
                <div className="onboard-card">
                    <h2 className="onboard-title">Join an Existing Group</h2>
                    <form className="onboard-form" onSubmit={joinGroup}>
                        <input 
                            type="text" 
                            placeholder="Invite Code"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            className="onboard-input"
                        />
                        <button type="submit" className="onboard-btn">Join Group</button>
                    </form>
                    <p onClick={() => onRouteChange("home")} className="onboard-back">Back</p>
                </div>
            ) : (
                <div className="onboard-error">Error Fetching Page</div>
            )}
        </div>
    )
}

export default Onboard;