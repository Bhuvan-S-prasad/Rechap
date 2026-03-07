"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { UserAvatar } from "../user-avatar";
import { ChevronRight, Hash, Loader2, MessageSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface ChannelItem {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
}

export const UserProfileModal = () => {
  const router = useRouter();
  const params = useParams();
  const origin = useOrigin();
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "userProfile";
  const member = data?.member;

  const [showChannels, setShowChannels] = useState(false);
  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sentChannelId, setSentChannelId] = useState<string | null>(null);

  const onMessageClick = () => {
    onClose();
    router.push(`/channels/${params?.channelId}/conversations/${member?.id}`);
  };

  const onInviteToggle = async () => {
    if (showChannels) {
      setShowChannels(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get("/api/channels/my-channels");
      setChannels(response.data);
      setShowChannels(true);
    } catch (error) {
      console.log("[FETCH_CHANNELS]", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [sendingChannelId, setSendingChannelId] = useState<string | null>(null);

  const onChannelInvite = async (channel: ChannelItem) => {
    try {
      setSendingChannelId(channel.id);
      const inviteLink = `${origin}/invite/${channel.inviteCode}`;

      await axios.post("/api/socket/direct-messages/send-invite", {
        memberId: member?.id,
        channelId: params?.channelId,
        inviteLink,
      });

      setSentChannelId(channel.id);
      setTimeout(() => setSentChannelId(null), 2000);
    } catch (error) {
      console.log("[SEND_INVITE]", error);
    } finally {
      setSendingChannelId(null);
    }
  };

  const handleClose = () => {
    setShowChannels(false);
    setSentChannelId(null);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card text-primary overflow-hidden sm:max-w-sm p-0 border-none">
        <div className="h-20 bg-zinc-900" />

        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end gap-x-4">
            <UserAvatar
              src={member?.user.imageUrl}
              className="h-20 w-20 border-[6px] border-card"
            />
          </div>

          <div className="mt-3">
            <h2 className="text-xl font-bold text-primary">
              {member?.user.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {member?.user.email}
            </p>
          </div>

          <div className="mt-5 border-t border-zinc-700 pt-5 space-y-2">
            <Button
              onClick={onMessageClick}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>

            <Button
              onClick={onInviteToggle}
              variant="outline"
              className="w-full border-zinc-700 hover:bg-zinc-800 text-primary font-semibold cursor-pointer justify-between"
              disabled={isLoading}
            >
              <span className="flex items-center">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Hash className="h-4 w-4 mr-2" />
                )}
                Invite to Channel
              </span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  showChannels && "rotate-90",
                )}
              />
            </Button>

            {showChannels && (
              <ScrollArea className="max-h-[180px]">
                <div className="space-y-1 pt-1">
                  {channels.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No channels found
                    </p>
                  )}
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => onChannelInvite(channel)}
                      className={cn(
                        "w-full flex items-center gap-x-2 px-3 py-2 rounded-md text-sm transition cursor-pointer",
                        "hover:bg-zinc-800 text-zinc-300 hover:text-white",
                        sentChannelId === channel.id &&
                          "bg-emerald-500/10 text-emerald-400",
                      )}
                    >
                      <img
                        src={channel.imageUrl}
                        alt={channel.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="truncate flex-1 text-left">
                        {channel.name}
                      </span>
                      {sendingChannelId === channel.id ? (
                        <Loader2 className="h-4 w-4 text-zinc-500 animate-spin shrink-0" />
                      ) : sentChannelId === channel.id ? (
                        <span className="text-xs text-emerald-400 shrink-0">
                          Sent!
                        </span>
                      ) : (
                        <ChevronRight className="h-3 w-3 text-zinc-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
