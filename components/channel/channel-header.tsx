"use client";

import { MemberRole } from "@/generated/prisma/enums";
import { ChannelWithMembersWithProfiles } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

interface ChannelHeaderProps {
  channel: ChannelWithMembersWithProfiles;
  role?: MemberRole;
}

export const ChannelHeader = ({ channel, role }: ChannelHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <div className="flex justify-between">
          <button className="text-sm font-semibold flex items-center px-3 h-10 rounded-xl hover:bg-foreground/10 dark:hover:bg-zinc-700/50 dark:text-neutral-200 transition">
            {channel.name}
            <ChevronDown className="h-5 w-5 ml-1" />
          </button>
          {isModerator && (
            <button className="text-white px-3 text-sm cursor-pointer rounded-2xl hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 dark:text-neutral-400 dark:hover:text-neutral-200 transition">
              <UserPlus className="h-4 w-4 ml-auto" />
            </button>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isAdmin && (
          <DropdownMenuItem className="text-primary px-3 py-2 text-sm cursor-pointer hover:bg-foreground/10 dark:hover:bg-zinc-700/50 dark:text-neutral-200 transition">
            channel Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="text-primary px-3 py-2 text-sm cursor-pointer hover:bg-foreground/10 dark:hover:bg-zinc-700/50 dark:text-neutral-200 transition">
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem className="text-primary px-3 py-2 text-sm cursor-pointer hover:bg-foreground/10 dark:hover:bg-zinc-700/50 dark:text-neutral-200 transition">
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className="text-primary px-3 py-2 text-sm cursor-pointer hover:bg-foreground/10 dark:hover:bg-zinc-700/50 dark:text-neutral-200 transition">
            Create Room
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className="text-destructive px-3 py-2 text-sm cursor-pointer hover:bg-foreground/10 dark:hover:bg-zinc-700/50 dark:text-neutral-200 transition">
            Delete Channel
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className="text-primary px-3 py-2 text-sm cursor-pointer hover:bg-foreground/10 dark:hover:bg-zinc-700/50 dark:text-neutral-200 transition">
            Leave Channel
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
