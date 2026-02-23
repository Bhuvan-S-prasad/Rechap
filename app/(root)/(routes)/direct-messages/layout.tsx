import { DMSidebar } from "@/components/dm/dm-sidebar";
import { MessageCircle } from "lucide-react";

const DirectMessagesLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      {/* Topbar for DM */}
      <div className="fixed z-50 top-0 left-0 w-full h-12 flex items-center justify-center px-4 bg-white dark:bg-background dark:border-neutral-800">
        <div className="flex items-center gap-x-2">
          <MessageCircle className="h-5 w-5 text-zinc-400" />
          <p className="font-semibold text-md text-zinc-500 dark:text-zinc-200">
            Direct Messages
          </p>
        </div>
      </div>
      <div className="h-full">
        <div className="max-md:hidden md:flex w-60 z-20 flex-col fixed top-12 bottom-0">
          <DMSidebar />
        </div>
        <main className="h-full md:pl-60">{children}</main>
      </div>
    </>
  );
};

export default DirectMessagesLayout;
