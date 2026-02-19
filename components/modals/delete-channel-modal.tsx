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

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteChannel";
  const { channel } = data;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/channels/${channel?.id}`);
      onClose();
      router.refresh();
      router.push("/")
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
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            Are you sure you want to delete{" "}
            <span className="font-bold text-emerald-500">{channel?.name}</span>?
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
              Delete Channel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
