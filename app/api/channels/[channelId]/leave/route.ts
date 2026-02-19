import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  try {
    const profile = await currentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { channelId } = await params;

    if (!channelId) {
      return new NextResponse("Channel ID Missing", { status: 400 });
    }

    const channel = await prisma.channel.update({
      where: {
        id: channelId,
        userId: {
          not: profile.id,
        },
        members: {
          some: {
            userId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            userId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNEL_LEAVE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
