import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Search, Plus } from "lucide-react";
import { DMUserItem } from "./dm-user-item";

export const DMSidebar = async () => {
  const profile = await currentUser();

  if (!profile) {
    return redirect("/sign-in");
  }

  // Find all conversations where the current user is involved (as memberOne or memberTwo)
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          memberOne: {
            userId: profile.id,
          },
        },
        {
          memberTwo: {
            userId: profile.id,
          },
        },
      ],
    },
    include: {
      memberOne: {
        include: {
          user: true,
        },
      },
      memberTwo: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      directMessages: {
        _count: "desc",
      },
    },
  });

  // Deduplicate by the other user's id so each user only appears once
  const seenUserIds = new Set<string>();
  const uniqueConversations = conversations.filter((conv) => {
    const otherUser =
      conv.memberOne.userId === profile.id ? conv.memberTwo : conv.memberOne;
    if (seenUserIds.has(otherUser.userId)) {
      return false;
    }
    seenUserIds.add(otherUser.userId);
    return true;
  });

  return (
    <div className="flex flex-col h-full text-primary w-full p-3 dark:bg-background border-t-[0.2px] border-l-[0.2px] border-zinc-800 rounded-tl-2xl">
      {/* Search bar */}
      <button className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
        <Search className="w-4 h-4 text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-400 group-hover:text-zinc-300 transition">
          Find or start a conversation
        </p>
      </button>

      <Separator className="bg-zinc-700 rounded-md my-2" />

      <ScrollArea className="flex-1 overflow-y-auto">
        {/* Direct Messages section header */}
        <div className="flex items-center justify-between px-2 py-2">
          <p className="text-xs uppercase font-semibold text-zinc-400">
            Direct Messages
          </p>
          <button className="text-zinc-400 hover:text-zinc-200 transition">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* DM user list */}
        <div className="space-y-[2px]">
          {uniqueConversations.length > 0 ? (
            uniqueConversations.map((conv) => {
              const otherMember =
                conv.memberOne.userId === profile.id
                  ? conv.memberTwo
                  : conv.memberOne;

              return (
                <DMUserItem
                  key={conv.id}
                  user={otherMember.user}
                  channelId={otherMember.channelId}
                  memberId={otherMember.id}
                />
              );
            })
          ) : (
            // Empty state — skeleton-like placeholders
            <div className="space-y-3 px-2 pt-2">
              {[140, 110, 160, 130, 120, 150, 100].map((width, i) => (
                <div key={i} className="flex items-center gap-x-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />
                  <div
                    className="h-4 rounded-md bg-zinc-800 animate-pulse"
                    style={{ width: `${width}px` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
