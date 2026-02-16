import { InviteAcceptCard } from "@/components/channel/invite-accept-card";
import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const InviteCodePage = async ({
  params,
}: {
  params: Promise<{ inviteCode: string }>;
}) => {
  const profile = await currentUser();

  if (!profile) {
    return redirect("/sign-in");
  }

  const { inviteCode } = await params;

  if (!inviteCode) {
    return redirect("/");
  }

  const channel = await prisma.channel.findUnique({
    where: { inviteCode },
    include: { members: true },
  });

  if (!channel) {
    return redirect("/");
  }

  const isAlreadyMember = channel.members.some(
    (member) => member.userId === profile.id,
  );

  if (isAlreadyMember) {
    return redirect(`/channels/${channel.id}`);
  }

  const acceptInvite = async () => {
    "use server";

    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await prisma.channel.update({
      where: { id: channel.id },
      data: {
        members: {
          create: {
            userId: user.id,
          },
        },
      },
    });

    return redirect(`/channels/${channel.id}`);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-zinc-100">
      <InviteAcceptCard
        channelName={channel.name}
        channelImage={channel.imageUrl}
        onAccept={acceptInvite}
      />
    </div>
  );
};

export default InviteCodePage;
