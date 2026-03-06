"use client";

import {
  LiveKitRoom,
  VideoConference,
  AudioConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2, Video, Mic } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`,
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-y-4 bg-background">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-indigo-500/10 animate-pulse" />
          {video ? (
            <Video className="h-8 w-8 text-indigo-400 relative z-10" />
          ) : (
            <Mic className="h-8 w-8 text-indigo-400 relative z-10" />
          )}
        </div>
        <div className="flex flex-col items-center gap-y-1">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-400 font-medium">
            Connecting to {video ? "video" : "voice"} room...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-lk-theme="default"
      className="h-full w-full rounded-tl-2xl overflow-hidden bg-background"
    >
      <LiveKitRoom
        video={video}
        audio={audio}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        style={{ height: "100%" }}
      >
        {video ? <VideoConference /> : <AudioConference />}
      </LiveKitRoom>
    </div>
  );
};
