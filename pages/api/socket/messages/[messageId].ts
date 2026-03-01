import { currentUserPages } from "@/lib/current-user-pages";
import { prisma } from "@/lib/prisma";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentUserPages(req);
    const { messageId, channelId, roomId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!messageId || !channelId || !roomId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!content) {
      return res.status(400).json({ error: "Missing required fields" });
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
      return res.status(404).json({ error: "Channel not found" });
    }

    const room = await prisma.room.findFirst({
      where: {
        id: roomId as string,
        channelId: channelId as string,
      },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const member = channel.members.find(
      (member) => member.userId === profile.id,
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message = await prisma.message.findFirst({
      where: {
        id: messageId as string,
        roomId: roomId as string,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === "ADMIN";
    const isModerator = member.role === "MODERATOR";
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (req.method === "DELETE") {
      message = await prisma.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: "",
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(403).json({ error: "Forbidden" });
      }
      message = await prisma.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${roomId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[API/Socket/Messages] error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
