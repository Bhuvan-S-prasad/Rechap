import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
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
      <div className="flex-1 flex flex-col overflow-hidden pt-12 min-h-0 no-scrollbar scrollbar-hide">
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
      </div>
      <ChatInput
        apiUrl={"/api/socket/messages"}
        query={{ channelId, roomId }}
        name={room?.name || ""}
        type="channel"
      />
    </div>
  );
};

export default RoomIdPage;
