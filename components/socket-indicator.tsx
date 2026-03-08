"use client";

import { useSocket } from "@/components/providers/socket-provider";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <div
        className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-sm"
        title="Connecting..."
      />
    );
  }

  return (
    <div
      className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm"
      title="Connected"
    />
  );
};
