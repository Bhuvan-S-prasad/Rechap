import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChannelHeader } from "./channel-header";

interface ChannelSidebarProps {
  channelId: string;
}

export const ChannelSidebar = async ({ channelId }: ChannelSidebarProps) => {
  const profile = await currentUser();

  if (!profile) {
    return redirect("/sign-in");
  }
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
    include: {
      rooms: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          user: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!channel) {
    return redirect("/");
  }

  const textRooms = channel.rooms.filter((room) => room.type === "TEXT");
  const voiceRooms = channel.rooms.filter((room) => room.type === "AUDIO");
  const videoRooms = channel.rooms.filter((room) => room.type === "VIDEO");

  const members = channel?.members.filter(
    (member) => member.userId !== profile.id,
  );

  const role = channel?.members.find(
    (member) => member.userId === profile.id,
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full p-3 dark:bg-background border-t-[0.2px] border-l-[0.2px] border-zinc-500 rounded-tl-2xl">
      <ChannelHeader channel={channel} role={role} />
    </div>
  );
};
