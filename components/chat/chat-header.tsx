"use client";

import { Hash, Users } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import { useMemberSidebar } from "@/hooks/use-member-sidebar";

interface ChatHeaderProps {
  channelId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  channelId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  const { toggle } = useMemberSidebar();

  return (
    <div className="sticky top-0 bg-chat-background w-full z-30 text-md font-semibold h-12 flex items-center justify-between px-6 border-b border-neutral-800">
      <div className="flex items-center gap-2">
        {type === "channel" && <Hash className="w-5 h-5 text-zinc-400" />}

        {type === "conversation" && (
          <UserAvatar src={imageUrl} className="h-5 w-5" />
        )}

        <p className="font-semibold text-md text-primary">{name}</p>
      </div>

      <div className="flex items-center gap-x-3">
        {type === "channel" && (
          <button
            onClick={toggle}
            className="text-zinc-500 hover:text-zinc-400 transition"
            title="Toggle Members"
          >
            <Users className="h-5 w-5" />
          </button>
        )}
        <SocketIndicator />
      </div>
    </div>
  );
};
