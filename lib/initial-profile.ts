import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export const initialProfile = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const profile = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (profile) return profile;

  const user = await currentUser();

  const newProfile = await prisma.user.create({
    data: {
      userId,
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.emailAddresses[0].emailAddress ?? "",
      imageUrl: user?.imageUrl ?? "",
    },
  });

  return newProfile;
};
