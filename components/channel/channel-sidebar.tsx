import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChannelHeader } from "./channel-header";
import { ScrollArea } from "../ui/scroll-area";
import { ChannelSearch } from "./channel-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, User, Video } from "lucide-react";

interface ChannelSidebarProps {
  channelId: string;
}

const iconMap = {
  TEXT: <Hash className="w-4 h-4" />,
  AUDIO: <Mic className="w-4 h-4" />,
  VIDEO: <Video className="w-4 h-4" />,
};

const roleIconMap = {
  ADMIN: <ShieldAlert className="w-4 h-4 mr-1 text-rose-500" />,
  MODERATOR: <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" />,
  GUEST: <User className="w-4 h-4 mr-1 text-zinc-500" />,
};

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
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="mt-3">
          <ChannelSearch
            data={[
              {
                label: "Text Room",
                type: "room",
                data: textRooms.map((room) => ({
                  icon: iconMap[room.type],
                  id: room.id,
                  name: room.name,
                })),
              },
              {
                label: "Voice room",
                type: "room",
                data: voiceRooms.map((room) => ({
                  icon: iconMap[room.type],
                  id: room.id,
                  name: room.name,
                })),
              },
              {
                label: "Video room",
                type: "room",
                data: videoRooms.map((room) => ({
                  icon: iconMap[room.type],
                  id: room.id,
                  name: room.name,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => ({
                  icon: roleIconMap[member.role],
                  id: member.id,
                  name: member.user.name,
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
