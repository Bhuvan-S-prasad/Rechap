"use client";

import type { Channel, Room } from "@/generated/prisma/client";
import { MemberRole, RoomType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";

interface ChannelRoomProps {
  room: Room;
  channel: Channel;
  role?: MemberRole;
}

const iconMap = {
  [RoomType.TEXT]: Hash,
  [RoomType.AUDIO]: Mic,
  [RoomType.VIDEO]: Video,
};

export const ChannelRoom = ({ room, channel, role }: ChannelRoomProps) => {
  const Icon = iconMap[room.type];
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/channels/${params.channelId}/rooms/${room.id}`);
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1",
        params?.roomId === room.id && "bg-zinc-700",
      )}
    >
      <Icon className="shrink-0 w-5 h-5 text-zinc-500" />
      <span
        className={cn(
          "line-clamp-1 font-semibold text-sm group-hover:text-white transition",
          params?.roomId === room.id && "text-zinc-200 group-hover:text-white",
        )}
      >
        {room.name}
      </span>
      {room.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <button className="hidden group-hover:block hover:bg-zinc-700/50 rounded-md transition">
              <Edit className="w-4 h-4 text-zinc-500" />
            </button>
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <button className="hidden group-hover:block hover:bg-zinc-700/50 rounded-md transition">
              <Trash className="w-4 h-4 text-zinc-500" />
            </button>
          </ActionTooltip>
        </div>
      )}
      {room.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-400" />
      )}
    </button>
  );
};
