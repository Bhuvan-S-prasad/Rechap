import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
      select: {
        id: true,
        name: true,
        imageUrl: true,
        inviteCode: true,
      },
    });

    return NextResponse.json(channels);
  } catch (error) {
    console.log("[MY_CHANNELS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
