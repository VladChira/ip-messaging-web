import {
  ArchiveIcon,
  CircleDotDashed,
  MessageCircleMore,
  Settings,
  Sun,
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

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col space-y-4 py-4 items-center">
              <SidebarMenuItem key="chats">
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
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
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                      <CircleDotDashed className="size-6" />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="friends">
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
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
              <SidebarMenuItem key="archive">
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                      <ArchiveIcon className="size-6" />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="theme">
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Sun className="size-6" />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="settings">
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Settings className="size-6" />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="profile">
                <SidebarMenuButton asChild size="lg">
                  <Link href="/">
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
