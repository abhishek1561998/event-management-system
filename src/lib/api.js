async function createEvent(eventData) {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  return response.json();
}

async function getInvitations(userId) {
  const response = await fetch(`/api/invitations?userId=${userId}`);
  return response.json();
}

async function acceptInvitation(invitationId) {
  const response = await fetch("/api/invitations/accept", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invitationId }),
  });
  return response.json();
}

async function rejectInvitation(invitationId) {
  const response = await fetch("/api/invitations/reject", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invitationId }),
  });
  return response.json();
}

export { createEvent, getInvitations, acceptInvitation, rejectInvitation };
