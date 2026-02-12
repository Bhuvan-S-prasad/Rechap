import { InitialModal } from "@/components/modals/initial-modal";
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

  return (
    <div className="flex items-center justify-center h-screen">
      <InitialModal />
    </div>
  );
};

export default SetUpPage;
