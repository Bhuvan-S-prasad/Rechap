"use client";

import { MessageCircle, Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

export const NavigationAction = () => {
  const { onOpen } = useModal();
  const router = useRouter();
  return (
    <>
      <ActionTooltip label="Direct Messages" side="right" align="center">
        <button
          className="group flex items-center"
          onClick={() => router.push("/direct-messages")}
        >
          <div
            className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all
            overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-primary"
          >
            <MessageCircle
              className="group-hover:text-primary-foreground transition-colors text-primary"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>

      <ActionTooltip label="Add a channel" side="right" align="center">
        <button
          className="group flex items-center"
          onClick={() => onOpen("createChannel")}
        >
          <div
            className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all
            overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-primary"
          >
            <Plus
              className="group-hover:text-primary-foreground transition-colors text-primary"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </>
  );
};
