import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8081",
  "https://rechap01.netlify.app",
];

function getCorsHeaders(origin: string | null) {
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function GET(
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

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
        members: {
          some: {
            userId: profile.id,
          },
        },
      },
      include: {
        rooms: {
          orderBy: {
            createdAt: "asc",
          },
        },
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

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    return NextResponse.json(channel, {
      headers: getCorsHeaders(req.headers.get("origin")),
    });
  } catch (error) {
    console.log("[CHANNEL_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

    return NextResponse.json(channel, {
      headers: getCorsHeaders(req.headers.get("origin")),
    });
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

    return NextResponse.json(channel, {
      headers: getCorsHeaders(req.headers.get("origin")),
    });
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
