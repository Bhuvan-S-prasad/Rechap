import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/room/media-room";
import { RoomType } from "@/generated/prisma/enums";
import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface RoomIdPageProps {
  params: Promise<{
    channelId: string;
    roomId: string;
  }>;
}

const RoomIdPage = async ({ params }: RoomIdPageProps) => {
  const { channelId, roomId } = await params;

  const profile = await currentUser();
  if (!profile) {
    return redirect("/sign-in");
  }

  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });

  const member = await prisma.member.findFirst({
    where: {
      userId: profile.id,
      channelId: channelId,
    },
  });

  if (!room || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-chat-background flex flex-col h-full">
      <ChatHeader
        channelId={channelId}
        name={room?.name || ""}
        type="channel"
      />
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 no-scrollbar scrollbar-hide">
        {room.type === RoomType.TEXT && (
          <>
            <ChatMessages
              member={member}
              name={room?.name || ""}
              chatId={roomId}
              type="room"
              apiUrl="/api/messages"
              socketUrl="/api/socket/messages"
              socketQuery={{
                roomId,
                channelId,
              }}
              paramKey="roomId"
              paramValue={roomId}
            />
            <ChatInput
              apiUrl={"/api/socket/messages"}
              query={{ channelId, roomId }}
              name={room?.name || ""}
              type="channel"
            />
          </>
        )}
        {room.type === RoomType.AUDIO && (
          <MediaRoom chatId={roomId} video={false} audio={true} />
        )}
        {room.type === RoomType.VIDEO && (
          <MediaRoom chatId={roomId} video={true} audio={true} />
        )}
      </div>
    </div>
  );
};

export default RoomIdPage;
