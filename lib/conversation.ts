import { prisma } from "./prisma";

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        const conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);
        if (!conversation) {
            return await createNewConversation(memberOneId, memberTwoId);
        }
        return conversation;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await prisma.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
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
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
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
    return conversation;
  } catch (error) {
    console.log(error);
    return null;
  }
};

