"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { ChannelWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";

const roleIcons = {
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-emerald-500" />,
  GUEST: "",
};

export const MembersModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "members";
  const { channel } = data as { channel: ChannelWithMembersWithProfiles };
  const [loadingId, setLoadingId] = useState("");

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden sm:max-w-md">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            {channel?.members.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {channel?.members.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-4">
              <UserAvatar src={member.user.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.user.name}
                  {roleIcons[member.role]}
                </div>
                <p className="text-xs text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
