import { NextResponse } from "next/server";
import pool from "../../../../lib/db.js";

export async function POST(request) {
  const { invitationId } = await request.json();

  try {
    await pool.query("UPDATE event_invitations SET status = ? WHERE id = ?", [
      "accepted",
      invitationId,
    ]);
    return NextResponse.json(
      { message: "Invitation accepted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
