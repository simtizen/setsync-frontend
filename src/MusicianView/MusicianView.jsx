import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MusicianView.css";

const MusicianHub = ({url}) => {
    const [upcomingSetlists, setUpcomingSetlists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSetlists();
    }, []);

    const fetchSetlists = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${url}/setlists`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setUpcomingSetlists(response.data.upcoming || []);
        } catch (err) {
            console.error("Error fetching setlists for musician view", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="musician-loading">Loading live setlists...</div>;
    }

    return (
        <div className="musician-container">
            <h2 className="musician-header">🎵 Musician Live View</h2>
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

                        <div className="setlist-songs-list">
                            {setlist.songs?.map((song, idx) => (
                                <div key={idx} className="setlist-song-item">
                                    <div className="setlist-song-header">
                                        <strong className="setlist-song-title">{idx + 1}. {song.title}</strong>
                                        <div className="setlist-song-badges">
                                            {song.key && <span className="badge badge-key">Key: {song.key}</span>}
                                            {song.bpm && <span className="badge badge-bpm">{song.bpm} BPM</span>}
                                        </div>
                                    </div>
                                    {song.notes && <p className="setlist-song-notes">Notes: {song.notes}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MusicianHub;