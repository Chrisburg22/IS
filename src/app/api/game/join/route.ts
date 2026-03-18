import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, nickname } = body;

    if (!pin || !nickname) {
      return NextResponse.json({ error: "PIN and nickname are required" }, { status: 400 });
    }

    // Trigger an event to the specific game channel
    await pusherServer.trigger(`game-${pin}`, "player-joined", {
      nickname,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Joined successfully" });
  } catch (error) {
    console.error("Error joining game:", error);
    return NextResponse.json({ error: "Failed to join game" }, { status: 500 });
  }
}
