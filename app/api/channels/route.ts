import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@/generated/prisma/enums";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !imageUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const channel = await prisma.channel.create({
      data: {
        userId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        rooms: {
          create: {
            name: "general",
            userId: profile.id,
          },
        },
        members: {
          create: {
            userId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("SERVER_POST: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const profile = await currentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const channels = await prisma.channel.findMany({
      where: {
        members: {
          some: {
            userId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(channels);
  } catch (error) {
    console.log("CHANNELS_GET_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
