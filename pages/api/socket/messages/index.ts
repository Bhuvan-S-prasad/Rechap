import { currentUserPages } from "@/lib/current-user-pages";
import { prisma } from "@/lib/prisma";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentUserPages(req);
    const { content, fileUrl } = req.body;
    const { channelId, roomId } = req.query;

    if (!profile) {
      return res.status(400).json({ error: "unAuthorised" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "cannelId missing" });
    }

    if (!roomId) {
      return res.status(400).json({ error: "roomId missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "content missing" });
    }

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        members: {
          some: {
            userId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "channel not found" });
    }

    const room = await prisma.room.findFirst({
      where: {
        id: roomId as string,
        channelId: channelId as string,
      },
    });

    if (!room) {
      return res.status(404).json({ error: "room not found" });
    }

    const member = channel.members.find(
      (member) => member.userId === profile.id,
    );

    if (!member) {
      return res.status(404).json({ error: "member not found" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        fileUrl: fileUrl || "",
        roomId: roomId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    const roomKey = `chat:${roomId}:messages`;

    res?.socket?.server?.io?.emit(roomKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[API/Socket/Messages] error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
