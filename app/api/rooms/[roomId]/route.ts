import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { MemberRole } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const profile = await currentUser();
    const { roomId } = await params;
    const { searchParams } = new URL(req.url);

    const channelId = searchParams.get("channelId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!channelId)
      return new NextResponse("Channel ID is required", { status: 400 });

    if (!roomId)
      return new NextResponse("Room ID is required", { status: 400 });

    const channel = await prisma.channel.update({
      where: {
        id: channelId,
        members: {
          some: {
            userId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        rooms: {
          delete: {
            id: roomId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("ROOM_DELETE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
