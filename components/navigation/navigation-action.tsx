"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";

export const NavigationAction = () => {
  return (
    <ActionTooltip label="Add a channel" side="right" align="center">
      
        <button className="group flex items-center">
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
  );
};
