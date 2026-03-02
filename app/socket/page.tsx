"use client";

import { useSocket } from "@/components/providers/socket-provider";

const Page = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <div className="text-rose-500 flex justify-center items-center h-screen">
        <p>failed</p>
      </div>
    );
  }

  return (
    <div className="text-emerald-500 flex justify-center items-center h-screen">
      <p>Live</p>
    </div>
  );
};

export default Page;
