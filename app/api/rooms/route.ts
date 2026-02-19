import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentUser();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Room name cannot be general", { status: 400 });
    }

    const channel = await prisma.channel.update({
      where: {
        id: channelId,
        members: {
          some: {
            userId: profile.id,
            role: {
              in: ["ADMIN", "MODERATOR"],
            },
          },
        },
      },
      data: {
        rooms: {
          create: {
            userId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("ROOM_POST", error);
    return new NextResponse("internal Error", { status: 500 });
  }
}
