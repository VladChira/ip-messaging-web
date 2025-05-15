import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import { AddFriendListItem } from "@/components/AddFriendItem";
import { Separator } from "@/components/ui/separator";
import YourFriendsTab from "@/components/YourFriendsTab";

export default function FriendsPage() {
    return (
        <>
            <h1 className="text-2xl font-bold px-6 pt-6">Friends</h1>
            <div className="flex h-full w-full px-6 gap-6">
                {/* Left: Tabs */}
                <div className="w-full max-w-xl flex flex-col">
                    <Tabs defaultValue="friends" className="flex flex-col flex-1">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="friends">Your Friends</TabsTrigger>
                            <TabsTrigger value="add">Add Friends</TabsTrigger>
                        </TabsList>

                        {/* Your Friends Tab */}
                        <TabsContent value="friends" className="flex-1">
                            <ScrollArea className="h-full border rounded-md p-2">
                                <YourFriendsTab />

                            </ScrollArea>
                        </TabsContent>

                        {/* Add Friends Tab */}
                        <TabsContent value="add" className="flex-1 space-y-4">
                            <Input placeholder="Search for users..." />
                            <ScrollArea className="h-full border rounded-md p-2">
                                <AddFriendListItem name="Donald Trump" username="therealdjt" avatarUrl="/djt.png" requestSent={false} />
                                <Separator className="my-2" />
                                <AddFriendListItem name="Nicusor Dan" username="nicu_sordan" avatarUrl="/nd11.png" requestSent={true} />
                                <Separator className="my-2" />
                                <AddFriendListItem name="George Simion" username="cg_fanboy" avatarUrl="/gs.png" requestSent={false} />
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
