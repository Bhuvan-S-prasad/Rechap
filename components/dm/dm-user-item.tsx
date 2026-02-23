"use client";

import { UserAvatar } from "../user-avatar";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DMUserItemProps {
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
  channelId: string;
  memberId: string;
}

export const DMUserItem = ({ user, channelId, memberId }: DMUserItemProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/channels/${channelId}/conversations/${memberId}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full",
        "hover:bg-zinc-700/50 transition mb-1 text-left",
      )}
    >
      <UserAvatar src={user.imageUrl} className="h-8 w-8 md:h-8 md:w-8" />
      <span className="line-clamp-1 font-semibold text-sm text-zinc-400 group-hover:text-zinc-200 transition">
        {user.name}
      </span>
    </button>
  );
};
