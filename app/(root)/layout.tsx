import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="max-md:hidden md:flex w-[72px] z-30 flex-col fixed top-12 bottom-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] pt-12 h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
