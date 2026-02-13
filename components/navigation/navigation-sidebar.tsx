import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const NavigationSidebar = async () => {
  const profile = await currentUser();
  if (!profile) {
    return redirect("/sign-in");
  }

  const channels = await prisma.channel.findMany({
    where: {
      members: {
        some: {
          userId: profile.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full py-3 dark:bg-[#1E1F22]">
    </div>
  );
};
