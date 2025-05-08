import { NextResponse } from "next/server";
import pool from "../../../lib/db.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      `SELECT ei.id, ei.status, e.title as event_title, e.event_date, e.location as event_location
       FROM event_invitations ei
       JOIN events e ON ei.event_id = e.id
       WHERE ei.user_id = ?`,
      [userId]
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}
