import { ChannelSidebar } from "@/components/channel/channel-sidebar";
import { Topbar } from "@/components/navigation/topbar";
import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RightMemberSidebar } from "@/components/channel/right-member-sidebar";

const ChannelLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ channelId: string }>;
}) => {
  const { channelId } = await params;
  const profile = await currentUser();

  if (!profile) {
    return redirect("/sign-in");
  }

  const channel = await prisma.channel.findFirst({
    where: {
      id: channelId,
      members: {
        some: {
          userId: profile.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!channel) {
    return redirect("/");
  }
  const role = channel.members.find(
    (member) => member.userId === profile.id,
  )?.role;

  return (
    <>
      <Topbar channelId={channelId} />
      <div className="h-full bg-chat-background flex flex-col rounded-tl-md">
        <div className="max-md:hidden md:flex w-60 z-20 flex-col fixed top-12 bottom-0">
          <ChannelSidebar channelId={channelId} />
        </div>
        <main className="flex-1 flex md:pl-60 min-h-0">
          <div className="flex-1 flex flex-col min-h-0">{children}</div>
          <RightMemberSidebar channel={channel} role={role} />
        </main>
      </div>
    </>
  );
};

export default ChannelLayout;
