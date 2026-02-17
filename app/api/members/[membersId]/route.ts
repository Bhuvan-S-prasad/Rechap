import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
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

    if (!params.memberId) {
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
              id: params.memberId,
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
    console.log("MEMBERS_ID_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
