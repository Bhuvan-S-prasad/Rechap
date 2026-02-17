import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ membersId: string }> },
) {
  try {
    const { membersId } = await params;
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID is missing", { status: 400 });
    }

    if (!membersId) {
      return new NextResponse("Member ID is missing", { status: 400 });
    }

    const channel = await prisma.channel.update({
      where: {
        id: channelId,
        userId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: membersId,
              userId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ membersId: string }> },
) {
  try {
    const { membersId } = await params;
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);

    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID is missing", { status: 400 });
    }

    if (!membersId) {
      return new NextResponse("Member ID is missing", { status: 400 });
    }

    const channel = await prisma.channel.update({
      where: {
        id: channelId,
        userId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: membersId,
            userId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[MEMBERS_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
