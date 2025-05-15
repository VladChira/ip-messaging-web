// /app/(main)/friends/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
//import { AddFriendListItem } from "@/components/AddFriendItem";
//import { Separator } from "@/components/ui/separator";
import YourFriendsTab from "@/components/YourFriendsTab";
import SearchUsersTab from "@/components/SearchUsersTab";
import FriendRequestsTab from "@/components/FriendRequestsTab";

export default function FriendsPage() {
    const [activeTab, setActiveTab] = useState("friends");

    return (
        <>
            <h1 className="text-2xl font-bold px-6 pt-6">Friends</h1>
            <div className="flex h-full w-full px-6 gap-6">
                {/* Left: Tabs */}
                <div className="w-full max-w-xl flex flex-col">
                    <Tabs 
                        value={activeTab} 
                        onValueChange={setActiveTab} 
                        className="flex flex-col flex-1"
                    >
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="friends">Your Friends</TabsTrigger>
                            <TabsTrigger value="add">Add Friends</TabsTrigger>
                            <TabsTrigger value="requests">Friend Requests</TabsTrigger>
                        </TabsList>

                        {/* Your Friends Tab */}
                        <TabsContent value="friends" className="flex-1">
                            <ScrollArea className="h-full border rounded-md p-2">
                                <YourFriendsTab />
                            </ScrollArea>
                        </TabsContent>

                        {/* Add Friends Tab */}
                        <TabsContent value="add" className="flex-1 space-y-4">
                            <ScrollArea className="h-full border rounded-md p-2">
                                <SearchUsersTab />
                            </ScrollArea>
                        </TabsContent>
                        
                        {/* Friend Requests Tab */}
                        <TabsContent value="requests" className="flex-1 space-y-4">
                            <ScrollArea className="h-full border rounded-md p-2">
                                <FriendRequestsTab />
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right: Placeholder */}
                <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
                    <User className="h-15 w-15 mb-2" />
                    <p className="text-center">Find your friends and start chatting!</p>
                </div>
            </div>
        </>
    );
}