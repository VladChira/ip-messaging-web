"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { UserData, chats, friends, getCurrentUser } from "@/lib/api";
import { ChatAppUser } from "@/lib/constants";
import { sendRefresh } from "@/lib/socket";

export function NewChatDialog() {
  const [userFriends, setFriends] = useState<ChatAppUser[]>([]);
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<UserData | null>(null);

  // Load the current user
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.userId) return;
      try {
        const data = await friends.getFriends();
        setFriends(data.friends || []);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        setFriends([]);
      } finally {
      }
    };

    fetchUsers();
  }, [user?.userId]);

  const handleStartChat = async (userId: number) => {
    console.log(`Starting chat with user ID: ${userId}`);
    
    try {
      const data = await chats.createChat("one_on_one", "test-one", [userId]);
      console.log("Created one on one chat:", data);
      sendRefresh(data.chat.chatId);
    } catch(err) {
      console.log("Failed to create one on one chat", err);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>
            Select a friend to start a new conversation
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh]">
          <div className="space-y-2 pr-4">
            {userFriends.map((user) => (
              <div
                key={user.userId}
                className="flex items-center justify-between p-3 rounded-md hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleStartChat(user.userId)}
                >
                  Start Chat
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}