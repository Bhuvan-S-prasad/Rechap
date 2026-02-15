import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";

interface TopbarProps {
  channelId: string;
}

export const Topbar = async ({ channelId }: TopbarProps) => {
  const profile = await currentUser();
  if (!profile) {
    return redirect("/sign-in");
  }

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    return null;
  }

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-12 flex items-center justify-center px-4 bg-white dark:bg-background dark:border-neutral-800">
      <div className="flex items-center gap-x-2">
        {channel.imageUrl && (
          <div className="h-8 w-8 relative">
            <Image
              fill
              src={channel.imageUrl}
              alt={channel.name}
              className="rounded-xl object-cover"
            />
          </div>
        )}
        <p className="font-semibold text-md text-zinc-500 dark:text-zinc-200">
          {channel.name}
        </p>
      </div>
    </div>
  );
};
