"use client";

import { useState, KeyboardEvent } from "react";
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

import { Chat, UserData, Message } from "@/lib/api";
import { getInitials } from "@/lib/constants";

interface ChatDetail {
  members: UserData[];
  messages: Message[];
}

interface CurrentChatPanelProps {
  user: UserData | null;
  chat: Chat;
  detail: ChatDetail;
  /** Called when user sends a new message */
  onSendMessage: (chatId: string, text: string) => void;
}

export function CurrentChatPanel({
  user,
  chat,
  detail,
  onSendMessage,
}: CurrentChatPanelProps) {
  const [inputText, setInputText] = useState("");

  // Determine display name
  const displayName =
    chat.chatType === "group"
      ? chat.name || "Unnamed Group"
      : detail.members.find((m) => m.userId !== user?.userId)?.name ||
        "Unknown";

  // Send handler
  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    onSendMessage(chat.chatId, text);
    setInputText("");
  };

  // Enter key → send
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatar.jpg" alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold">{displayName}</p>
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessageList>
          {detail.messages.map((msg) => {
            const isSent = msg.senderId === user?.userId;

            // find the message author in members
            const author = detail.members.find(
              (m) => m.userId === msg.senderId
            );
            const fallbackInitials = user
              ? getInitials(author?.name || user.name)
              : "ERR";
            return (
              <ChatBubble
                key={msg.messageId}
                variant={isSent ? "sent" : "received"}
              >
                <ChatBubbleAvatar fallback={fallbackInitials} />
                <ChatBubbleMessage variant={isSent ? "sent" : "received"}>
                  {msg.text}
                </ChatBubbleMessage>
              </ChatBubble>
            );
          })}
        </ChatMessageList>
      </div>

      {/* Footer Input */}
      <div className="p-4 border-t flex items-center gap-2">
        <Button size="icon" variant="outline">
          <Smile className="size-5" />
        </Button>
        <Button size="icon" variant="outline">
          <Paperclip className="size-4" />
        </Button>
        <Input
          placeholder="Type your message..."
          className="flex-1 h-15"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button size="icon" variant="outline" onClick={handleSend}>
          <Send className="size-5" />
        </Button>
      </div>
    </div>
  );
}
