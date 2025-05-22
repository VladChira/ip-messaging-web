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
import { Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import Cookies from 'js-cookie';
import { UserData, chats, friends, getCurrentUser } from "@/lib/api";
import { ChatAppUser } from "@/lib/constants";

interface CreateGroupDialogProps {
  onChatCreated?: () => void;
}

export function CreateGroupDialog({ onChatCreated }: CreateGroupDialogProps) {
  const [chatFriends, setFriends] = useState<ChatAppUser[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [user, setUser] = useState<UserData | null>(null);

  // Load the current user
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setGroupName("");
      setSelectedFriends([]);
      setIsCreating(false);
    }
  }, [open]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.userId) return;
      try {
        const data = await friends.getFriends();
        setFriends(data.friends || []);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        setFriends([]);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [user?.userId, open]);

  const toggleFriendSelection = (userId: number) => {
    setSelectedFriends(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (selectedFriends.length < 1) {
      alert("Please select at least 2 friends for a group chat");
      return;
    }

    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    setIsCreating(true);

    try {
      const data = await chats.createChat("group", groupName, selectedFriends);
      console.log("Created group chat:", data);
      
      // Close the dialog on success
      setOpen(false);
      
      // Call the onChatCreated callback to refresh the chat list
      if (onChatCreated) {
        onChatCreated();
      }
    } catch (err) {
      console.error("Failed to create group chat:", err);
      alert("Failed to create group chat. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredFriends = chatFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Create group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
          <DialogDescription>
            Enter a group name and select friends to add
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <ScrollArea className="mt-4 max-h-[40vh]">
          <div className="space-y-2 pr-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.userId}
                className="flex items-center p-3 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => toggleFriendSelection(friend.userId)}
              >
                <Checkbox 
                  checked={selectedFriends.includes(friend.userId)}
                  onCheckedChange={() => toggleFriendSelection(friend.userId)}
                  className="mr-3"
                />
                <div className="flex items-center gap-3 flex-1">
                  <Avatar>
                    <AvatarImage alt={friend.name} />
                    <AvatarFallback>
                      {friend.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">@{friend.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleCreateGroup}
            disabled={selectedFriends.length < 2 || !groupName.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}