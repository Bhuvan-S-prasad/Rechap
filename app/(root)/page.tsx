import { initialProfile } from "@/lib/initial-profile";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const SetUpPage = async () => {
  const profile = await initialProfile();

  const channel = await prisma.channel.findFirst({
    where: {
      members: {
        some: {
          userId: profile.userId,
        },
      },
    },
  });

  if (channel) {
    return redirect(`/channel/${channel.id}`);
  }

  return <div>{profile.name}</div>;
};

export default SetUpPage;
