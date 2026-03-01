"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-rose-500 border-none text-white">
        failed
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-emerald-500 border-none text-white">
      Live
    </Badge>
  );
};
