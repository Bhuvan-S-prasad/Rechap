"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

export const DeleteRoomModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteRoom";
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {channel, room} = data;
  
  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/rooms/${room?.id}`,
        query: {
          channelId: channel?.id,
        }
      })
      await axios.delete(url);
      onClose();
      router.refresh();
      router.push(`/channels/${channel?.id}`)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  } 

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-primary p-0 overflow-hidden sm:max-w-md">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-primary">
            Delete Room
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            Are you sure you want to delete{" "}
            <span className="font-bold text-emerald-500">{room?.name}</span>?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-card px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onClick}
              disabled={isLoading}
            >
              Delete Room
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
