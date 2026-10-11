import React, { useState, useEffect } from "react";
import "./SetlistForm.css";

const SetlistForm = ({ existingSetlist, onSave, onCancel }) => {
    const formatForDateInput = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split('T')[0];
    };
    
    useEffect(() => {
        if (existingSetlist) {
            setFormData({
                title: existingSetlist.title || "",
                eventDate: formatForDateInput(existingSetlist.eventDate),
                lead: existingSetlist.lead || "",
                bgvs: existingSetlist.bgvs || "",
                songs: existingSetlist.songs?.length > 0 ? existingSetlist.songs : [{ title: "", key: "", bpm: "", lead: "", bgvs: "", notes: "" }] 
            });
        }else {
            setFormData({
                title: "",
                eventDate: "",
                lead: "",
                bgvs: "",
                songs: [
                    { title: "", key: "", bpm: "", lead: "", bgvs: "", notes: "" }
                ]
            });
        }
    }, [existingSetlist]);

    const [formData, setFormData] = useState(existingSetlist || {
        title: "",
        eventDate: "",
        lead: "",
        bgvs: "",
        songs: [
            { title: "", key: "", bpm: "", lead: "", bgvs: "", notes: "" }
        ]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGeneralChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSongChange = (index, e) => {
        const updatedSongs = [...formData.songs];
        updatedSongs[index][e.target.name] = e.target.value;
        setFormData({ ...formData, songs: updatedSongs });
    };

    const addSong = () => {
        setFormData({
            ...formData,
            songs: [...formData.songs, { title: "", key: "", bpm: "", lead: "", bgvs: "", notes: "" }]
        });
    };

    const removeSong = (indexToRemove) => {
        const updatedSongs = formData.songs.filter((_, i) => i !== indexToRemove);
        setFormData({ ...formData, songs: updatedSongs });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true); 

        await onSave(formData);

        setIsSubmitting(false); 
    };

    return (
        <div className="setlist-form-container">
            <h2 className="setlist-form-title">
                {existingSetlist ? "Edit Setlist" : "Create New Setlist"}
            </h2>
            
            <form onSubmit={onSubmit}>
                <div className="setlist-section">
                    <input
                        type="text"
                        name="title"
                        placeholder="Event Title (e.g., Sunday Service)"
                        value={formData.title}
                        onChange={handleGeneralChange}
                        className="setlist-input"
                        required
                    />
                    <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleGeneralChange}
                        className="setlist-input"
                        required
                    />
                    <input
                        type="text"
                        name="lead"
                        placeholder="Lead Singer"
                        value={formData.lead}
                        onChange={handleGeneralChange}
                        className="setlist-input"
                    />
                     <input
                        type="text"
                        name="bgvs"
                        placeholder="Background Vocals"
                        value={formData.bgvs}
                        onChange={handleGeneralChange}
                        className="setlist-input"
                    />
                </div>
                
                <hr className="setlist-divider" />
                <h3 className="setlist-subtitle">Songs</h3>

                {formData.songs.map((song, index) => (
                    <div key={index} className="song-card">
                        <div className="song-card-header">
                            <h4 className="song-card-title">Song {index + 1}</h4>
                            {formData.songs.length > 1 && (
                                <button type="button" onClick={() => removeSong(index)} className="setlist-btn setlist-btn-danger">
                                    Remove
                                </button>
                            )}
                        </div>

                        <input
                            type="text"
                            name="title"
                            placeholder="Song Title"
                            value={song.title}
                            onChange={(e) => handleSongChange(index, e)}
                            className="setlist-input"
                            required
                        />
                        <div className="song-row">
                            <input
                                type="text"
                                name="key"
                                placeholder="Key"
                                value={song.key}
                                onChange={(e) => handleSongChange(index, e)}
                                className="setlist-input"
                            />
                            <input
                                type="number"
                                name="bpm"
                                placeholder="BPM"
                                value={song.bpm}
                                onChange={(e) => handleSongChange(index, e)}
                                className="setlist-input"
                            />
                        </div>
                        <div className="song-row">
                            <input
                                type="text"
                                name="lead"
                                placeholder="Song Lead Singer"
                                value={song.lead}
                                onChange={(e) => handleSongChange(index, e)}
                                className="setlist-input"
                            />
                            <input
                                type="text"
                                name="bgvs"
                                placeholder="Song BGVs"
                                value={song.bgvs}
                                onChange={(e) => handleSongChange(index, e)}
                                className="setlist-input"
                            />
                        </div>
                    </div>
                ))}

                <button type="button" onClick={addSong} className="setlist-btn setlist-btn-outline">
                    + Add Another Song
                </button>

                <div className="setlist-actions">
                    <button type="button" onClick={onCancel} className="setlist-btn setlist-btn-secondary">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="setlist-btn setlist-btn-primary"
                        onClick={(e) => onSubmit(e)}
                    >
                        {isSubmitting ? "Saving..." : (existingSetlist ? "Update Setlist" : "Save Setlist")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SetlistForm;