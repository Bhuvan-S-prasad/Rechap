import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  try {
    const profile = await currentUser();
    const { channelId } = await params;
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const channel = await prisma.channel.update({
      where: {
        id: channelId,
        userId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  try {
    const profile = await currentUser();
    const { channelId } = await params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const channel = await prisma.channel.delete({
      where: {
        id: channelId,
        userId: profile.id,
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
