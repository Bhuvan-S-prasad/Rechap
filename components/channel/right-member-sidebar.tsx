"use client";

import { useMemberSidebar } from "@/hooks/use-member-sidebar";
import { MemberRole } from "@/generated/prisma/enums";
import { ChannelMember } from "./channel-member";
import { ScrollArea } from "../ui/scroll-area";
import { ChannelSection } from "./channel-section";

import { ChannelWithMembersWithProfiles } from "@/types";

interface RightMemberSidebarProps {
  channel: ChannelWithMembersWithProfiles;
  role?: MemberRole;
}

export const RightMemberSidebar = ({
  channel,
  role,
}: RightMemberSidebarProps) => {
  const { isOpen } = useMemberSidebar();

  if (!isOpen) {
    return null;
  }

  const members = channel.members;

  const admins = members.filter((member) => member.role === MemberRole.ADMIN);
  const moderators = members.filter(
    (member) => member.role === MemberRole.MODERATOR,
  );
  const guests = members.filter((member) => member.role === MemberRole.GUEST);

  return (
    <div className="w-60 bg-chat-background flex flex-col h-full border-l border-zinc-800">
      <ScrollArea className="flex-1 w-full p-4">
        <ChannelSection
          label="Members"
          role={role}
          sectionType="members"
          channel={channel}
        />
        {!!admins.length && (
          <div className="mb-4 mt-4">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase mb-2">
              Admins — {admins.length}
            </h3>
            {admins.map((member) => (
              <ChannelMember key={member.id} member={member} />
            ))}
          </div>
        )}
        {!!moderators.length && (
          <div className="mb-4">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase mb-2">
              Moderators — {moderators.length}
            </h3>
            {moderators.map((member) => (
              <ChannelMember key={member.id} member={member} />
            ))}
          </div>
        )}
        {!!guests.length && (
          <div className="mb-4">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase mb-2">
              Members — {guests.length}
            </h3>
            {guests.map((member) => (
              <ChannelMember key={member.id} member={member} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
