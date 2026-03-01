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
import qs from "query-string";

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.delete(url);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-primary p-0 overflow-hidden sm:max-w-md">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-primary">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            Are you sure you want to delete this message?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-card px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onClick}
              disabled={isLoading}
            >
              Delete Message
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
