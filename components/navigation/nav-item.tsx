"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";

interface NavItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavItem = ({ id, imageUrl, name }: NavItemProps) => {
  const params = useParams();
  const router = useRouter();

  const isActive = params.channelId === id;

  const onClick = () => {
    router.push(`/channels/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={onClick}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            isActive && "h-[32px]",
          )}
        />

        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            isActive && "bg-primary/10 rounded-[16px]",
          )}
        >
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>
      </button>
    </ActionTooltip>
  );
};
