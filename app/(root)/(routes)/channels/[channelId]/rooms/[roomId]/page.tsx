import { ChatHeader } from "@/components/chat/chat-header";
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

  //   if (!room || member) {
  //     return redirect("/");
  //   }

  return (
    <div className="bg-chat-background flex flex-col h-full">
      <ChatHeader
        channelId={channelId}
        name={room?.name || ""}
        type="channel"
      />
    </div>
  );
};

export default RoomIdPage;
