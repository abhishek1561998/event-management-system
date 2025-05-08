"use client";

import { acceptInvitation, rejectInvitation } from "../../lib/api.js";

export default function InvitationCard({ invitation, onUpdate }) {
  const handleAccept = async () => {
    const response = await acceptInvitation(invitation.id);
    if (response.message) {
      onUpdate();
    }
  };

  const handleReject = async () => {
    const response = await rejectInvitation(invitation.id);
    if (response.message) {
      onUpdate();
    }
  };

  return (
    <div className="invitation-card">
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          {invitation.event_title}
        </h3>
        <p style={{ color: "#666" }}>{invitation.event_date}</p>
        <p style={{ color: "#666" }}>
          {invitation.event_location || "No location"}
        </p>
        <p style={{ color: "#666" }}>Status: {invitation.status}</p>
      </div>
      {invitation.status === "pending" && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="accept-btn" onClick={handleAccept}>
            Accept
          </button>
          <button className="reject-btn" onClick={handleReject}>
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
