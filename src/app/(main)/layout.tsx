"use client"

import AppSidebar from "@/components/AppSidebar";
import ThemeToggler from "@/components/ThemeToggler";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  MessageCircleMore,
  CircleDotDashed,
  Users,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      // only mark “/” as active if we’re exactly on the homepage
      return pathname === "/";
    }
    // for any other route, mark active if the pathname starts with that prefix
    return pathname.startsWith(href);
  };

  return (
    <SidebarProvider open={true}>
      {/* desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 flex justify-around items-center bg-sidebar-background border-t py-2 md:hidden">
        <Link href="/">
          <MessageCircleMore
            className={cn(
              "size-6",
              isActive("/") ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </Link>
        <Link href="/status/">
          <CircleDotDashed
            className={cn(
              "size-6",
              isActive("/status/") ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </Link>
        <Link href="/friends/">
          <Users
            className={cn(
              "size-6",
              isActive("/friends/") ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </Link>
        <Link href="/settings/">
          <Settings
            className={cn(
              "size-6",
              isActive("/settings/") ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </Link>
        <ThemeToggler />
      </nav>

      {/* main content */}
      <SidebarInset className="pt-0 pb-16 md:pt-2 md:pb-0">
        <div className="flex flex-1 flex-col gap-4 p-5 pt-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
