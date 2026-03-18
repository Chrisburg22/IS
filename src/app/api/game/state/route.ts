import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, state, ...data } = body;

    if (!pin || !state) {
      return NextResponse.json({ error: "PIN and state are required" }, { status: 400 });
    }

    // `state` could be "game-started", "question-changed", "show-results", "final-results"
    await pusherServer.trigger(`game-${pin}`, "game-state-changed", {
      state,
      ...data,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating game state:", error);
    return NextResponse.json({ error: "Failed to update game state" }, { status: 500 });
  }
}
