import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { Resend } from "resend";
import pool from "../../../../lib/db.js";

const resend = new Resend(process.env.RESEND_API_KEY);
const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("Upstash-Signature");

  const isValid = await receiver.verify({
    signature,
    body,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { eventId, userEmails, type, eventTitle, eventDate } = JSON.parse(body);

  let emailsToSend = userEmails;

  if (type === "reminder") {
    const [pendingUsers] = await pool.query(
      `SELECT u.email 
       FROM event_invitations ei 
       JOIN users u ON ei.user_id = u.id 
       WHERE ei.event_id = ? AND ei.status = 'pending'`,
      [eventId]
    );
    emailsToSend = pendingUsers.map((user) => user.email);
  }

  if (!emailsToSend || !emailsToSend.length) {
    return NextResponse.json(
      { message: `No ${type} emails to send for event ${eventId}` },
      { status: 200 }
    );
  }

  try {
    const batchSize = 100;
    for (let i = 0; i < emailsToSend.length; i += batchSize) {
      const batch = emailsToSend.slice(i, i + batchSize);
      const subject =
        type === "initial"
          ? `Invitation to ${eventTitle}`
          : `Reminder: ${eventTitle} is Happening Soon!`;
      const text =
        type === "initial"
          ? `You are invited to ${eventTitle} on ${eventDate}. Please accept or reject the invitation.`
          : `Reminder: ${eventTitle} is on ${eventDate}. You haven't responded yet. Please accept or reject.`;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: batch,
        subject,
        text,
      });

      const column =
        type === "initial"
          ? "initial_notification_sent"
          : "reminder_notification_sent";
      const userEmailsPlaceholder = batch.map(() => "?").join(",");
      await pool.query(
        `UPDATE event_invitations 
         SET ${column} = TRUE 
         WHERE event_id = ? AND user_id IN (
           SELECT id FROM users WHERE email IN (${userEmailsPlaceholder})
         )`,
        [eventId, ...batch]
      );

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return NextResponse.json(
      { message: `Sent ${type} emails for event ${eventId}` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error sending ${type} emails:`, error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
