import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: Promise<{
    memberId: string;
    channelId: string;
  }>;
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const { memberId, channelId } = await params;
  const profile = await currentUser();
  if (!profile) {
    return redirect("/sign-in");
  }

  const currentMember = await prisma.member.findFirst({
    where: {
      userId: profile.id,
      channelId: channelId,
    },
    include: {
      user: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId,
  );

  if (!conversation) {
    return redirect(`/channels/${channelId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.userId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-chat-background flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.user.imageUrl}
        name={otherMember.user.name}
        channelId={channelId}
        type="conversation"
      />
      <ChatMessages
        name={otherMember.user.name}
        member={currentMember}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/api/direct-messages"
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          channelId: channelId,
          conversationId: conversation.id,
        }}
        paramKey="conversationId"
        paramValue={conversation.id}
      />
      <ChatInput
        name={otherMember.user.name}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversation.id,
        }}
      />
    </div>
  );
};

export default MemberIdPage;
