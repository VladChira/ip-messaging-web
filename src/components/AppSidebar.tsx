"use client";

import {
  CircleDotDashed,
  LogOut,
  MessageCircleMore,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ThemeToggler from "./ThemeToggler";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col space-y-4 py-4 items-center">
              <SidebarMenuItem key="chats">
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <div
                      className={cn(
                        "flex aspect-square size-8 items-center justify-center rounded-lg transition-colors",
                        isActive("/")
                          ? "bg-foreground text-background"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <MessageCircleMore
                        className="size-6"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="status">
                <SidebarMenuButton asChild>
                  <Link href="/status/">
                    <div
                      className={cn(
                        "flex aspect-square size-8 items-center justify-center rounded-lg transition-colors",
                        isActive("/status/")
                          ? "bg-foreground text-background"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <CircleDotDashed className="size-6" />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="friends">
                <SidebarMenuButton asChild>
                  <Link href="/friends/">
                    <div
                      className={cn(
                        "flex aspect-square size-8 items-center justify-center rounded-lg transition-colors",
                        isActive("/friends/")
                          ? "bg-foreground text-background"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <Users className="size-6" />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col space-y-4 py-4 items-center">
              <SidebarMenuItem key="logout">
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                      <LogOut className="size-6" />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="theme">
                <SidebarMenuButton asChild>
                  <ThemeToggler />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="settings">
                <SidebarMenuButton asChild>
                  <Link href="/settings/">
                    <div
                      className={cn(
                        "flex aspect-square size-8 items-center justify-center rounded-lg transition-colors",
                        isActive("/settings/")
                          ? "bg-foreground text-background"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <Settings className="size-6" />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="profile">
                <SidebarMenuButton asChild size="lg">
                  <Link href="/settings/account">
                    <Avatar className="h-11 w-11 rounded-lg">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="Avatar Logo"
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
