import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MusicianView.css";

const MusicianHub = ({ url, setlistId, onSelectSetlist, onBack }) => {
    const [upcomingSetlists, setUpcomingSetlists] = useState([]);
    const [selectedSetlist, setSelectedSetlist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (setlistId) {
            fetchSingleSetlist(setlistId);
        } else {
            fetchUpcomingSetlists();
        }
    }, [setlistId]);

    const fetchSingleSetlist = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${url}/setlists/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setSelectedSetlist(response.data);
            console.log(selectedSetlist);
        } catch (err) {
            const backendError = err.response?.data?.error || "Error fetching setlist details";
            setError(backendError);
            console.error("Error fetching setlist for musician view", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUpcomingSetlists = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${url}/setlists`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setUpcomingSetlists(response.data.upcoming || []);
        } catch (err) {
            const backendError = err.response?.data?.error || "Error fetching upcoming setlists";
            setError(backendError);
            console.error("Error fetching upcoming setlists for musician view", err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderSongsList = (songs) => {
        if (!songs || songs.length === 0) {
            return <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>No songs in this setlist.</p>;
        }

        return (
            <div className="setlist-songs-list">
                {songs.map((song, idx) => (
                    <div key={idx} className="setlist-song-item">
                        <div className="setlist-song-header">
                            <strong className="setlist-song-title">{idx + 1}. {song.title}</strong>
                            <div className="setlist-song-badges">
                                {song.key && <span className="badge badge-key">Key: {song.key}</span>}
                                {song.bpm && <span className="badge badge-bpm">{song.bpm} BPM</span>}
                            </div>
                        </div>
                        {(song.lead || song.bgvs) && (
                            <p style={{ color: "var(--text-secondary)", margin: "4px 0 0 0", fontSize: "0.85rem" }}>
                                {song.lead && `Lead: ${song.lead}`}
                                {song.lead && song.bgvs && " | "}
                                {song.bgvs && `BGVs: ${song.bgvs}`}
                            </p>
                        )}
                        {song.notes && <p className="setlist-song-notes">Notes: {song.notes}</p>}
                    </div>
                ))}
            </div>
        );
    };

    if (isLoading) {
        return <div className="musician-loading">Loading setlist details...</div>;
    }

    if (error) {
        return (
            <div className="musician-container">
                {onBack && (
                    <div className="musician-top-bar">
                        <button type="button" onClick={onBack} className="musician-btn outline">
                            ← Back
                        </button>
                    </div>
                )}
                <p className="musician-empty" style={{ color: "var(--danger)" }}>{error}</p>
            </div>
        );
    }

    // Mode 1: Dedicated single setlist view
    if (setlistId && selectedSetlist) {
        return (
            <div className="musician-container">
                <div className="musician-top-bar">
                    {onBack && (
                        <button type="button" onClick={onBack} className="musician-btn outline">
                            ← Back
                        </button>
                    )}
                </div>

                <div className="setlist-live-card">
                    <h2 className="musician-header" style={{ marginBottom: "12px" }}>🎵 {selectedSetlist.title}</h2>
                    <p className="setlist-live-meta">
                        📅 {new Date(selectedSetlist.eventDate).toLocaleDateString("en-US", { dateStyle: 'full' })}
                        {selectedSetlist.lead && ` | Leader: ${selectedSetlist.lead}`}
                        {selectedSetlist.bgvs && ` | BGVs: ${selectedSetlist.bgvs}`}
                    </p>

                    {renderSongsList(selectedSetlist.songs)}
                </div>
            </div>
        );
    }

    // Mode 2: Upcoming Setlists list
    return (
        <div className="musician-container">
            <h2 className="musician-header">🎵 Upcoming Setlists</h2>
            <p className="musician-subtitle">Select a setlist to load into the dedicated musician view.</p>

            {upcomingSetlists.length === 0 ? (
                <p className="musician-empty">No upcoming setlists available.</p>
            ) : (
                upcomingSetlists.map((setlist) => (
                    <div key={setlist._id} className="setlist-live-card">
                        <h3 className="setlist-live-title">{setlist.title}</h3>
                        <p className="setlist-live-meta">
                            📅 {new Date(setlist.eventDate).toLocaleDateString("en-US", { dateStyle: 'full' })}
                            {setlist.lead && ` | Leader: ${setlist.lead}`}
                        </p>

                        {renderSongsList(setlist.songs)}

                        {onSelectSetlist && (
                            <button
                                type="button"
                                onClick={() => onSelectSetlist(setlist._id)}
                                className="musician-btn accent"
                                style={{ marginTop: "16px" }}
                            >
                                Load into Musician View
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default MusicianHub;