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
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(400).json({ error: "unAuthorised" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "conversationId missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "content missing" });
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

    const member = conversation.memberOne.userId === profile.id ? conversation.memberOne : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ error: "member not found" });
    }

    const message = await prisma.directMessage.create({
      data: {
        content,
        fileUrl: fileUrl || "",
        conversationId: conversation.id,
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

    const roomKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(roomKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[API/Socket/Direct-Messages] error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
