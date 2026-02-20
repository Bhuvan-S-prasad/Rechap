"use client";

import { Member, MemberRole } from "@/generated/prisma/client";
import { UserAvatar } from "../user-avatar";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";

interface ChannelMemberProps {
  member: Member & {
    user: {
      name: string;
      imageUrl: string;
    };
  };
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-1 text-rose-500" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" />,
  [MemberRole.GUEST]: <User className="w-4 h-4 mr-1 text-zinc-500" />,
};

export const ChannelMember = ({ member }: ChannelMemberProps) => {
    const icon = roleIconMap[member.role];
  return (
    <div className="px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1">
      <UserAvatar src={member.user.imageUrl} className="h-5 w-5" />
      <span className="line-clamp-1 font-semibold text-sm group-hover:text-white transition">
        {member.user.name}
      </span>
      {icon}
    </div>
  );
};
