import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css"

const Dashboard = ({userId, usrname, groupName, groupId, belongsToGroup, role, handleLogout, onRouteChange, setEditingSetlist, existingSetlist, url}) => {
    const [inviteCode, setInviteCode] = useState(null);
    const [isLoadingCode, setIsLoadingCode] = useState(false);
    const [upComingSetlists, setUpComingSetlists] = useState([]);
    const [passSetlists, setPastSetlists] = useState([]);

    useEffect(() => {
        if (belongsToGroup) {
            getSetlists();
        }
    }, [belongsToGroup]);

    const getInviteCode = async () => {
        setIsLoadingCode(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${url}/admin/groups/get-invite-code/${groupId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setInviteCode(response.data.inviteCode);
        } catch (err) {
            const backendError = err.response?.data?.error || "Failed to fetch invite code";
            alert(backendError);
        } finally {
            setIsLoadingCode(false);
        }
    };

    const getSetlists = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`${url}/setlists`, {
                headers: {"Authorization": `Bearer ${token}`}
            });

            setUpComingSetlists(response.data.upcoming || []);
            setPastSetlists(response.data.past || []);

        } catch (err) {
            const backendError = err.response?.data?.error || "Error Getting Setlists";
            alert(backendError);
        }
    };

    const handleDelete = async (id, state) => {
        const confirmed = window.confirm("Are you sure you want to delete this setlist?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            const response = await axios.delete(`${url}/admin/setlists/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            alert(response.data.msg);

            if (state === "upcoming") {
                setUpComingSetlists(
                    (prev) => prev.filter((item) => item._id !== id
                ));
            }

            if (state === "past") {
                setPastSetlists(
                    (prev) => prev.filter((item) => item._id !== id)
                );
            }

        } catch (err) {
            const backendError = err.response?.data?.error || "Error Deleting Setlist";
            console.log(err);
            alert(backendError);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            dateStyle: 'medium'
        });
    };

    return (
        <div className="Dashboard-container">
            {!belongsToGroup ? (
                <div className="no-group-view">
                    <h3>Welcome to SetSync!</h3>
                    <button className="theme-btn" onClick={() => onRouteChange('create-group')}>Create a Group</button>
                    <button className="theme-btn" onClick={() => onRouteChange('join-group')}>Join a Group</button>
                </div>
            ) : (
                <div className="active-group-view">
                    <h3>{groupName}</h3>
                    <p style={{ color: "var(--text-secondary)" }}>Role: {role}</p> 
                    
                    {role === "admin" && (
                        <div style={{ marginTop: "10px", padding: "15px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                            <p style={{ margin: "0 0 10px 0", color: "var(--text-primary)" }}><strong>Group Invite Code:</strong></p>
                            
                            {!inviteCode ? (
                                <button className="theme-btn" onClick={getInviteCode} disabled={isLoadingCode}>
                                    {isLoadingCode ? "Fetching..." : "Reveal Code"}
                                </button>
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                                    <code style={{ fontSize: "1.2em", backgroundColor: "var(--bg-main)", color: "var(--accent)", padding: "5px 10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                                        {inviteCode}
                                    </code>
                                    <button className="theme-btn outline" onClick={() => setInviteCode(null)}>Hide</button>
                                </div>
                            )}
                            <br/>
                            <button className="theme-btn accent" onClick={() => {
                                setEditingSetlist(null);
                                onRouteChange('setlist-form');
                            }}>
                                Create New Setlist
                            </button>
                        </div>
                    )}
                    <hr style={{ margin: "20px 0", borderColor: "var(--border)", borderStyle: "solid", borderWidth: "1px 0 0 0" }} />

                    <div className="setlist-container">
                        <h3 style={{ color: "var(--text-primary)" }}>Upcoming Setlists</h3>
                        {upComingSetlists.length === 0 ? (
                            <p style={{ color: "var(--text-secondary)" }}>No upcoming setlists found.</p>
                        ) : (
                            upComingSetlists.map(setlist => (
                                <div key={setlist._id || setlist.id} style={{ border: `1px solid var(--border)`, backgroundColor: "var(--bg-card)", padding: "15px", marginBottom: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ color: "var(--text-primary)", margin: "0 0 5px 0" }}>{setlist.title}</h3>
                                    <p style={{ color: "var(--text-secondary)", margin: "0 0 15px 0" }}>Date: {formatDate(setlist.eventDate)}</p>
                                    <p style={{ color: "var(--text-primary)", margin: "5px 0" }}>Lead Singer: {setlist.lead}</p>
                                    <p style={{ color: "var(--text-primary)", margin: "5px 0" }}>Background Vocals: {setlist.BGVs}</p>
                                    
                                    <div style={{ marginTop: "15px" }}>
                                        <h4 style={{ color: "var(--text-primary)" }}>Songs:</h4>
                                        {setlist.songs && setlist.songs.map((song, index) => (
                                            <div key={index} style={{ backgroundColor: "var(--bg-main)", borderLeft: "4px solid var(--accent)", padding: "10px", marginTop: "10px", borderRadius: "4px" }}>
                                                <p style={{ color: "var(--text-primary)", margin: "0 0 5px 0" }}><strong>{song.title}</strong> - Key: <span style={{ color: "var(--accent)", fontWeight: "bold" }}>{song.key}</span> | BPM: {song.bpm}</p>
                                                <p style={{ color: "var(--text-secondary)", margin: "0 0 5px 0", fontSize: "0.9em" }}>Lead: {song.lead} | BGVs: {song.bgvs}</p>
                                                {song.notes && <p style={{ color: "var(--text-primary)", margin: "0", fontSize: "0.9em", padding: "5px", backgroundColor: "rgba(255, 193, 7, 0.1)", borderRadius: "4px" }}>Notes: {song.notes}</p>}
                                            </div>
                                        ))}
                                    </div>
                                    {role === 'admin' && (
                                        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                                            <button className="theme-btn" onClick={() => {
                                                setEditingSetlist(setlist); 
                                                onRouteChange('setlist-form'); 
                                            }}>
                                                Edit Setlist
                                            </button>
                                            <button className="theme-btn danger" onClick={() => handleDelete(setlist._id, "upcoming")}>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <hr style={{ margin: "20px 0", borderColor: "var(--border)", borderStyle: "solid", borderWidth: "1px 0 0 0" }} />

                    <div className="past-setlist-container">
                        <h3 style={{ color: "var(--text-primary)" }}>Past Setlists</h3>
                        {passSetlists.length === 0 ? (
                            <p style={{ color: "var(--text-secondary)" }}>No past setlists found.</p>
                        ) : (
                            passSetlists.map(setlist => (
                                <div key={setlist._id || setlist.id} style={{ border: `1px solid var(--border)`, backgroundColor: "var(--bg-card)", padding: "15px", marginBottom: "15px", borderRadius: "8px", opacity: 0.8 }}>
                                    <h3 style={{ color: "var(--text-primary)", margin: "0 0 5px 0" }}>{setlist.title}</h3>
                                    <p style={{ color: "var(--text-secondary)", margin: "0 0 15px 0" }}>Date: {formatDate(setlist.eventDate)}</p>
                                    <p style={{ color: "var(--text-primary)", margin: "5px 0" }}>Lead Singer: {setlist.lead}</p>
                                    <p style={{ color: "var(--text-primary)", margin: "5px 0" }}>Background Vocals: {setlist.BGVs}</p>
                                    
                                    <div style={{ marginTop: "15px" }}>
                                        <h4 style={{ color: "var(--text-primary)" }}>Songs:</h4>
                                        {setlist.songs && setlist.songs.map((song, index) => (
                                            <div key={index} style={{ backgroundColor: "var(--bg-main)", borderLeft: "4px solid var(--text-secondary)", padding: "10px", marginTop: "10px", borderRadius: "4px" }}>
                                                <p style={{ color: "var(--text-primary)", margin: "0 0 5px 0" }}><strong>{song.title}</strong> - Key: {song.key} | BPM: {song.bpm}</p>
                                                <p style={{ color: "var(--text-secondary)", margin: "0 0 5px 0", fontSize: "0.9em" }}>Lead: {song.lead} | BGVs: {song.bgvs}</p>
                                                {song.notes && <p style={{ color: "var(--text-primary)", margin: "0", fontSize: "0.9em", padding: "5px", backgroundColor: "rgba(255, 193, 7, 0.1)", borderRadius: "4px" }}>Notes: {song.notes}</p>}
                                            </div>
                                        ))}
                                    </div>
                                    {role === 'admin' && (
                                        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                                            <button className="theme-btn" onClick={() => {
                                                setEditingSetlist(setlist); 
                                                onRouteChange('setlist-form'); 
                                            }}>
                                                Edit
                                            </button>
                                            <button className="theme-btn danger" onClick={() => handleDelete(setlist._id, "past")}>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;