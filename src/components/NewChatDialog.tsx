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

import Cookies from 'js-cookie';
import { UserData, getCurrentUser } from "@/lib/api";
import { ChatAppUser } from "@/lib/constants";

export function NewChatDialog() {
  const [friends, setFriends] = useState<ChatAppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setLoading(true);
        const response = await fetch(
          "https://c9server.go.ro/messaging-api/get-friends-by-user-id/" +
          user?.userId.toString(),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        setFriends(data.friends || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        setError("Could not load friends list. Please try again later.");
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.userId]);

  const handleStartChat = (userId: number) => {
    console.log(`Starting chat with user ID: ${userId}`);
    // Here you would start a new chat with the selected user
    // For now, we'll just close the dialog
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New
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
            {friends.map((user) => (
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