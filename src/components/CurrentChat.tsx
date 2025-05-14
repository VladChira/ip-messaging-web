"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Paperclip, Send } from "lucide-react";
import { ChatMessageList } from "./ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "./ui/chat/chat-bubble";

export function CurrentChatPanel() {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {/* Left side: Avatar + Name + Online */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatar.jpg" alt="@user" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold">Donald Trump</p>
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessageList>
          <ChatBubble variant="sent">
            <ChatBubbleAvatar fallback="RO" />
            <ChatBubbleMessage variant="sent">
              Hello, why are we jobless programmers?
            </ChatBubbleMessage>
          </ChatBubble>
          <ChatBubble variant="received">
            <ChatBubbleAvatar fallback="DJT" />
            <ChatBubbleMessage variant="received">
              Hi! It&apos;s the end of Big Tech, programmers will be poor. Buy Bitcoin instead. 🚀🚀
            </ChatBubbleMessage>
          </ChatBubble>
          <ChatBubble variant="received">
            <ChatBubbleAvatar fallback="DJT" />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        </ChatMessageList>
      </div>

      {/* Footer: Input + Buttons */}
      <div className="p-4 border-t flex items-center gap-2">
        <Button size="icon" variant="outline">
          <Smile className="size-5" />
        </Button>
        <Button size="icon" variant="outline">
          <Paperclip className="size-4" />
        </Button>
        <Input placeholder="Type your message..." className="flex-1 h-15" />
        <Button size="icon" variant="outline">
          <Send className="size-5" />
        </Button>
      </div>
    </div>
  );
}
