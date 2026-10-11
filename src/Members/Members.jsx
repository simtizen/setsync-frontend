import React, { useState, useEffect } from "react";
import axios from "axios"
import "./Members.css";

const Members = ({ userId, role, url }) => {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${url}/members`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setMembers(response.data);
        } catch (err) {
            const backendError = err.response?.data?.error || "Failed to fetch group members";
            alert(backendError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMakeAdmin = async (memberId, memberName) => {
        if (!window.confirm(`Are you sure you want to make ${memberName} an admin?`)) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${url}/admin/groups/make-admin`, 
                { memberId },
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            alert(response.data.msg);
            fetchMembers(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.error || "Error updating role");
        }
    };

    const handleRemoveMember = async (memberId, memberName) => {
        if (!window.confirm(`Are you sure you want to remove ${memberName} from the group?`)) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${url}/admin/groups/remove-member`, {
                headers: { "Authorization": `Bearer ${token}` },
                data: { memberId } 
            });
            alert(response.data.msg);
            fetchMembers(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.error || "Error removing member");
        }
    };

    const handleResetPassword = async (memberId, memberName) => {
        const newPassword = prompt(`Enter a new temporary password for ${memberName}:`);
        if (!newPassword || newPassword.trim() === "") return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${url}/admin/groups/reset-password`,
                { memberId, newPassword },
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            alert(response.data.msg);
        } catch (err) {
            alert(err.response?.data?.error || "Error resetting password");
        }
    };

    if (isLoading) {
        return <div className="members-loading">Loading team members...</div>;
    }

    return (
        <div className="members-container">
            <h2 className="members-header">👥 Team Members</h2>
            
            {members.length === 0 ? (
                <p className="members-empty">No members found in this group.</p>
            ) : (
                <div className="members-list">
                    {members.map((member) => {
                        const isSelf = member._id === userId;
                        return (
                            <div key={member._id} className="member-card">
                                <div className="member-info">
                                    <h4 className="member-name">
                                        {member.usrname} {isSelf && <span className="member-self-tag">(You)</span>}
                                    </h4>
                                    <span className={`member-role-badge ${member.role === "admin" ? "admin-badge" : "standard-badge"}`}>
                                        {member.role.toUpperCase()}
                                    </span>
                                </div>

                                {role === "admin" && !isSelf && (
                                    <div className="member-actions">
                                        {member.role !== "admin" && (
                                            <button 
                                                onClick={() => handleMakeAdmin(member._id, member.usrname)}
                                                className="member-btn member-btn-admin"
                                            >
                                                Make Admin
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleResetPassword(member._id, member.usrname)}
                                            className="member-btn member-btn-reset"
                                        >
                                            Reset Password
                                        </button>
                                        <button 
                                            onClick={() => handleRemoveMember(member._id, member.usrname)}
                                            className="member-btn member-btn-remove"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Members;