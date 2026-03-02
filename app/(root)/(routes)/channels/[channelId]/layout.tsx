import { ChannelSidebar } from "@/components/channel/channel-sidebar";
import { Topbar } from "@/components/navigation/topbar";
import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
  });
  if (!channel) {
    return redirect("/");
  }
  return (
    <>
      <Topbar channelId={channelId} />
      <div className="h-full bg-chat-background flex flex-col">
        <div className="max-md:hidden md:flex w-60 z-20 flex-col fixed top-12 bottom-0">
          <ChannelSidebar channelId={channelId} />
        </div>
        <main className="flex-1 flex flex-col md:pl-60 min-h-0">
          {children}
        </main>
      </div>
    </>
  );
};

export default ChannelLayout;
