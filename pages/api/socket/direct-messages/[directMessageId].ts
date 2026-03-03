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
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!directMessageId || !conversationId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (req.method === "PATCH" && !content) {
      return res.status(400).json({ error: "Missing content" });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              userId: profile.id,
            },
          },
          {
            memberTwo: {
              userId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            user: true,
          },
        },
        memberTwo: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "conversation not found" });
    }

    const member =
      conversation.memberOne.userId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ error: "member not found" });
    }

    let directMessage = await prisma.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === "ADMIN";
    const isModerator = member.role === "MODERATOR";
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (req.method === "DELETE") {
      directMessage = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
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
      directMessage = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
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

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[API/Socket/Messages] error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
