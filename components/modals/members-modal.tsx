"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";
import {
  Check,
  Loader2,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Trash,
} from "lucide-react";
import { ChannelWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MemberRole } from "@/generated/prisma/enums";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIcons: Record<string, React.ReactNode> = {
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-emerald-500" />,
  GUEST: null,
};

export const MembersModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();

  const isModalOpen = isOpen && type === "members";

  const channel = (data as { channel?: ChannelWithMembersWithProfiles })
    ?.channel;

  const [loadingId, setLoadingId] = useState("");

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          channelId: channel?.id,
          memberId,
        },
      });
      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { channel: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden sm:max-w-md">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            {channel?.members.length ?? 0} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {channel?.members.map(
            (member: ChannelWithMembersWithProfiles["members"][number]) => (
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
                {channel.userId !== member.userId &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="h-4 w-4 mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, "GUEST")
                                  }
                                >
                                  <ShieldQuestion className="h-4 w-4 mr-2" />
                                  <span>Guest</span>
                                  {member.role === "GUEST" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, "MODERATOR")
                                  }
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  <span>Moderator</span>
                                  {member.role === "MODERATOR" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Trash className="h-4 w-4 mr-2" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Loader2 className="h-4 w-4 ml-auto animate-spin" />
                )}
              </div>
            ),
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
