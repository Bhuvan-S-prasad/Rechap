"use client";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";
import "@livekit/components-styles";
import { Room } from "@/generated/prisma/client";
import { useSession } from "@livekit/components-react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const [videoTracks, setVideoTracks] = useState<MediaStreamTrack[]>([]);
  const [audioTracks, setAudioTracks] = useState<MediaStreamTrack[]>([]);

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(`api/livekit?room=${chatId}&username=${name}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="dark"
      video={video}
      audio={audio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
