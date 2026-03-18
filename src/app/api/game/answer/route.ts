import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, nickname, answerIndex, questionIndex } = body;

    if (!pin || !nickname || answerIndex === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Notify the host that a player answered
    await pusherServer.trigger(`game-${pin}`, "player-answered", {
      nickname,
      answerIndex,
      questionIndex,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 });
  }
}
