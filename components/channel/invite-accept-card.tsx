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
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* gradient overlays */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-950/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-linear-to-tl from-blue-900/10 via-transparent to-transparent" />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Main */}
      <div className="max-w-md w-full bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl overflow-hidden relative z-10">
        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-zinc-100">
              You have been invited
            </h2>
          </div>

          {/* Channel info */}
          <div className="flex items-center gap-4 p-4 rounded-md bg-zinc-800/50 border border-zinc-700/50">
            <div className="relative w-14 h-14 shrink-0 rounded-md overflow-hidden">
              <Image
                src={channelImage}
                alt={channelName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-zinc-100 truncate">
                {channelName}
              </h3>
            </div>
          </div>

          {/* Accept button */}
          <Button
            onClick={onAccept}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Accept Invite
          </Button>
        </div>
      </div>
    </div>
  );
};
