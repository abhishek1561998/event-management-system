import { NextResponse } from "next/server";
import pool from "../../../lib/db.js";
import qstashClient from "../../../lib/qstash.js";

export async function POST(request) {
  const { title, description, event_date, location, created_by } =
    await request.json();

  try {
    const [eventResult] = await pool.query(
      "INSERT INTO events (title, description, event_date, location, created_by) VALUES (?, ?, ?, ?, ?)",
      [title, description, event_date, location, created_by]
    );
    const eventId = eventResult.insertId;

    const [users] = await pool.query(
      "SELECT id, email FROM users WHERE id != ?",
      [created_by]
    );

    const invitationPromises = users.map((user) =>
      pool.query(
        "INSERT INTO event_invitations (event_id, user_id, status) VALUES (?, ?, ?)",
        [eventId, user.id, "pending"]
      )
    );
    await Promise.all(invitationPromises);

    const userEmails = users.map((user) => user.email);

    await qstashClient.publishJSON({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/qstash/emails`,
      body: {
        eventId,
        userEmails,
        type: "initial",
        eventTitle: title,
        eventDate: event_date,
      },
      delay: 60 * 60,
    });

    const eventDate = new Date(event_date);
    const reminderTime = new Date(eventDate.getTime() - 60 * 60 * 1000);
    const reminderDelay = Math.max(
      0,
      Math.floor((reminderTime.getTime() - Date.now()) / 1000)
    );

    if (reminderDelay > 0) {
      await qstashClient.publishJSON({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/qstash/emails`,
        body: {
          eventId,
          type: "reminder",
          eventTitle: title,
          eventDate: event_date,
        },
        delay: reminderDelay,
      });
    }

    return NextResponse.json(
      { message: "Event created, notifications scheduled" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
