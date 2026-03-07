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

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { memberId, inviteLink } = req.body;

    if (!memberId || !inviteLink) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the target member
    const targetMember = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!targetMember) {
      return res.status(404).json({ error: "Target member not found" });
    }

    // Find current user's member in the same channel
    const currentMember = await prisma.member.findFirst({
      where: {
        userId: profile.id,
        channelId: targetMember.channelId,
      },
    });

    if (!currentMember) {
      return res
        .status(403)
        .json({ error: "You are not a member of this channel" });
    }

    // Get or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            memberOneId: currentMember.id,
            memberTwoId: memberId,
          },
          {
            memberOneId: memberId,
            memberTwoId: currentMember.id,
          },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          memberOneId: currentMember.id,
          memberTwoId: memberId,
        },
      });
    }

    // Create the direct message
    const message = await prisma.directMessage.create({
      data: {
        content: `Hey! Join my channel: ${inviteLink}`,
        fileUrl: "",
        conversationId: conversation.id,
        memberId: currentMember.id,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    // Emit the socket event for real-time updates!
    const roomKey = `chat:${conversation.id}:messages`;
    res?.socket?.server?.io?.emit(roomKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[API/Socket/Direct-Messages/Send-Invite] error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
