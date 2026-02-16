"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

interface InviteAcceptCardProps {
  channelName: string;
  channelImage: string;
  onAccept: () => Promise<void>;
}

export const InviteAcceptCard = ({
  channelName,
  channelImage,
  onAccept,
}: InviteAcceptCardProps) => {
  return (
    <div className="bg-white text-black rounded-xl shadow-lg p-8 w-full max-w-md text-center space-y-6">
      <h2 className="text-2xl font-bold">You have been invited</h2>

      <div className="flex flex-col items-center space-y-3">
        <Image
          src={channelImage}
          alt="Channel"
          width={80}
          height={80}
          className="h-20 w-20 rounded-full object-cover"
        />

        <p className="text-lg font-semibold">{channelName}</p>
      </div>

      <form action={onAccept}>
        <Button type="submit" className="w-full">
          Accept Invite
        </Button>
      </form>
    </div>
  );
};
