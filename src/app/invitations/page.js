"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "../../lib/auth.js";
import { getInvitations } from "../../lib/api.js";
import InvitationCard from "../components/InvitationCard.js";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchInvitations = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);

    try {
      const data = await getInvitations(currentUser.id);
      if (Array.isArray(data)) {
        setInvitations(data);
      } else {
        setError("Failed to fetch invitations");
      }
    } catch (err) {
      setError("Error fetching invitations");
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "#dc2626" }}>{error}</div>;
  }

  return (
    <div>
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}
      >
        Your Invitations
      </h1>
      {invitations.length === 0 ? (
        <p>No invitations found.</p>
      ) : (
        invitations.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            onUpdate={fetchInvitations}
          />
        ))
      )}
    </div>
  );
}
