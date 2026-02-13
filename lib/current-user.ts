import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const currentUser = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const profile = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
