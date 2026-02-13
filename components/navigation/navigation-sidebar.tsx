import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavItem } from "./nav-item";
import { UserButton } from "@clerk/nextjs";

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
    <div className="space-y-4 flex flex-col items-center h-full text-white w-full py-3 dark:bg-[#1E1F22]">
      {/* add New channel action */}
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-800 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {/* channels */}
        {channels.map((channel) => (
          <div key={channel.id} className="mb-4">
            <NavItem
              id={channel.id}
              imageUrl={channel.imageUrl}
              name={channel.name}
            />
          </div>
        ))}
      </ScrollArea>

      {/* user profile button */}
      <div className="pb-3 mt-auto flex items-center justify-center w-full gap-x-2">
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};
