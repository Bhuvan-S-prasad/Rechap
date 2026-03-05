import { AccessToken } from "livekit-server-sdk";
import { currentUser } from "@/lib/current-user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = req.nextUrl.searchParams.get("room");

    if (!room) {
      return new NextResponse("Room name is required", { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return new NextResponse("LiveKit server misconfigured", { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: profile.id,
      name: profile.name,
      ttl: "10m",
    });

    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
    });
  } catch (error) {
    console.log("[LIVEKIT_TOKEN]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
