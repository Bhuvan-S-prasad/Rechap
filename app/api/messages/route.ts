import { Message } from "@/generated/prisma/client";
import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentUser();

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const roomId = searchParams.get("roomId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!roomId) {
      return new NextResponse("Room ID is required", { status: 400 });
    }

    let message: Message[] = [];

    if (cursor) {
      message = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          roomId: roomId,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      message = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          roomId: roomId,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (message.length === MESSAGES_BATCH) {
      nextCursor = message[message.length - 1].id;
    }

    return NextResponse.json({
      items: message,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
