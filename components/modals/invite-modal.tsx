"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "invite";
  const origin = useOrigin();
  const { channel } = data;
  const inviteUrl = `${origin}/invite/${channel?.inviteCode}`;
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      if (!channel?.id) return;

      const response = await axios.patch(
        `/api/channels/${channel.id}/invite-code`,
      );
      onOpen("invite", { channel: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden sm:max-w-md">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite people to your Channel
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-8 space-y-4">
          <Label className="uppercase text-xs font-bold text-zinc-500">
            Channel Invite Link
          </Label>

          <div className="flex items-center gap-2">
            <Input
              readOnly
              className="flex-1 bg-zinc-100/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={isLoading}
            />
            <Button
              size="icon"
              disabled={isLoading}
              className="shrink-0"
              onClick={onCopy}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              variant="link"
              size="sm"
              className="text-xs text-zinc-500 px-0 flex items-center gap-2"
              onClick={onNew}
              disabled={isLoading}
            >
              Generate a new link
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
