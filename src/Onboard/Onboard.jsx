import React, { useState } from "react";
import axios from "axios";
import "./Onboard.css";
import { usePopUp } from "../PopUp/PopUpContext";

const Onboard = ({route, onRouteChange, refreshProfile, url}) => {
    const { showPopUp } = usePopUp();
    const [groupName, setGroupName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [isjoining, setIsJoining] = useState(false);
    const [iscreating, setIsCreating] = useState(false)

    const createGroup = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.post(`${url}/create-group`, {
                name: groupName
            }, 
            {
                headers: {'Authorization': `Bearer ${token}`}
            });

            showPopUp(response.data.msg, "success");
            await refreshProfile();
            onRouteChange("home");
        } catch (err) {
            const backendError = err.response?.data?.error || "Error Creating Group";
            showPopUp(backendError, "error");
        }
    }

    const joinGroup = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.post(`${url}/join-group`, {
                inviteCode: inviteCode
            }, 
            {
                headers: {'Authorization': `Bearer ${token}`}
            });

            showPopUp(response.data.msg, "success");
            await refreshProfile();
            onRouteChange("home");
        } catch (err) {
            const backendError = err.response?.data?.error || "Error Joining Group";
            showPopUp(backendError, "error");
        }
    }

    const handleJoin = async (e) => {
        e.preventDefault();

        if (isjoining) return;

        setIsJoining(true);

        try {
            await joinGroup();
        } finally {
            setIsJoining(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        if (iscreating) return;

        setIsCreating(true);

        try {
            await createGroup();
        } finally {
            setIsCreating(false);
        }
    };



    return (
        <div className="onboard-container">
            {route === 'create-group' ? (
                <div className="onboard-card">
                    <h2 className="onboard-title">Create a New Group</h2>
                    <form className="onboard-form" onSubmit={handleCreate}>
                        <input 
                            type="text" 
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="onboard-input"
                        />
                        <button 
                            type="submit" 
                            className="onboard-btn"
                            disabled={iscreating}
                        >
                           {iscreating ? "Creating Group...." : "Create Group"}
                        </button>
                    </form>
                    <p onClick={() => onRouteChange("home")} className="onboard-back">Back</p>
                </div>
            ) : route === 'join-group' ? (
                <div className="onboard-card">
                    <h2 className="onboard-title">Join an Existing Group</h2>
                    <form className="onboard-form" onSubmit={handleJoin}>
                        <input 
                            type="text" 
                            placeholder="Invite Code"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            className="onboard-input"
                        />
                        <button 
                            type="submit" 
                            className="onboard-btn"
                            disabled={isjoining}
                        >
                            {isjoining? "Joining ....." : "Join Group"}
                        </button>
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