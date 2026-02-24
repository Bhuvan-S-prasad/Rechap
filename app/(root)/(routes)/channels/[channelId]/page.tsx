import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: Promise<{
    channelId: string;
  }>;
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const { channelId } = await params;
  const profile = await currentUser();

  if (!profile) {
    return redirect("/sign-in");
  }
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
      members: {
        some: {
          userId: profile.id,
        },
      },
    },
    include: {
      rooms: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialRoom = channel?.rooms[0];

  if (initialRoom?.name !== "general") {
    return null;
  }

  return redirect(`/channels/${channelId}/rooms/${initialRoom.id}`);
};

export default ChannelIdPage;
