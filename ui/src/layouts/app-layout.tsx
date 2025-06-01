import { AppSidebar } from "@/components/sidebar";
import { Header } from "@/components/sidebar/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className=" md:peer-data-[variant=inset]:rounded md:peer-data-[variant=inset]:my-0 md:peer-data-[variant=inset]:mx-0">
        <Header />
        <main className="px-4 flex flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
