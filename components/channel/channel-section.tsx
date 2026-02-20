"use client";

import { MemberRole, RoomType } from "@/generated/prisma/enums";
import { ChannelWithMembersWithProfiles } from "@/types";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ChannelSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "rooms" | "members";
  roomType?: RoomType;
  channel?: ChannelWithMembersWithProfiles;
}

export const ChannelSection = ({
  label,
  role,
  sectionType,
  roomType,
  channel,
}: ChannelSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-400">{label}</p>
      {role !== MemberRole.GUEST && sectionType === "rooms" && (
        <ActionTooltip label="Create Room" side="top">
          <button
            onClick={() => onOpen("createRoom")}
            className="text-zinc-400 hover:text-zinc-300 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { channel } )}
            className="text-zinc-400 hover:text-zinc-300 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};  
