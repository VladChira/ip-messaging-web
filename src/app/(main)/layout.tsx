import AppSidebar from "@/components/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";;
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider open={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-5 pt-2">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
