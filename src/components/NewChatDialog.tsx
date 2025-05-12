"use client";

import { useState } from "react";
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

// Hardcoded users list
const users = [
  { id: 1, name: "Donald Trump", username: "realDonaldTrump", avatar: "/avatars/donald.jpg" },
  { id: 2, name: "Elon Musk", username: "elonmusk", avatar: "/avatars/elon.jpg" },
  { id: 3, name: "Mark Zuckerberg", username: "zuck", avatar: "/avatars/mark.jpg" },
  { id: 4, name: "Bill Gates", username: "BillGates", avatar: "/avatars/bill.jpg" },
  { id: 5, name: "Jeff Bezos", username: "JeffBezos", avatar: "/avatars/jeff.jpg" },
  { id: 6, name: "Sundar Pichai", username: "sundarpichai", avatar: "/avatars/sundar.jpg" },
  { id: 7, name: "Tim Cook", username: "tim_cook", avatar: "/avatars/tim.jpg" },
  { id: 8, name: "Satya Nadella", username: "satyanadella", avatar: "/avatars/satya.jpg" },
];

export function NewChatDialog() {
  const [open, setOpen] = useState(false);

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
            Select a user to start a new conversation
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh]">
          <div className="space-y-2 pr-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-md hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
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
                  onClick={() => handleStartChat(user.id)}
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