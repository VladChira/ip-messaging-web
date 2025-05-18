"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Paperclip, Send, CheckCheck } from "lucide-react";
import { ChatMessageList } from "./ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "./ui/chat/chat-bubble";

import { Chat, UserData, Message, ChatMember, chats } from "@/lib/api";
import { getInitials } from "@/lib/constants";
import { isMessageRead } from "@/lib/chatUtils";

interface ChatDetail {
  members: UserData[];
  messages: Message[];
  chatMembers: ChatMember[]; // Properly typed ChatMember objects from backend
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
      : detail.members.find((m) => String(m.userId) !== String(user?.userId))?.name ||
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

  // Mark messages as read when chat is opened
  useEffect(() => {
    const markAsRead = async () => {
      if (detail.messages.length > 0 && user) {
        const lastMessage = detail.messages[detail.messages.length - 1];
        // Only mark as read if the last message wasn't sent by the current user
        if (String(lastMessage.senderId) !== String(user.userId)) {
          try {
            await chats.markAsRead(chat.chatId, lastMessage.messageId);
          } catch (error) {
            console.error("Failed to mark messages as read:", error);
          }
        }
      }
    };

    markAsRead();
  }, [chat.chatId, detail.messages, user]);

  // Sort messages by sentAt to ensure correct order
  const sortedMessages = [...detail.messages].sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );

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
          {sortedMessages.map((msg) => {
            const isSent = String(msg.senderId) === String(user?.userId);

            // find the message author in members
            const author = detail.members.find(
              (m) => String(m.userId) === String(msg.senderId)
            );
            const fallbackInitials = author ? getInitials(author?.name) : "ERR";
            
            // Check if message is read (only for sent messages)
            const messageIsRead = isSent 
              ? isMessageRead(msg, sortedMessages, detail.chatMembers, user?.userId || 0)
              : false;

            return (
              <ChatBubble
                key={msg.messageId}
                variant={isSent ? "sent" : "received"}
              >
                <ChatBubbleAvatar fallback={fallbackInitials} />
                <ChatBubbleMessage variant={isSent ? "sent" : "received"}>
                  <div className="flex flex-col gap-1">
                    <span>{msg.text}</span>
                    {/* Show double ticks and timestamp for sent messages */}
                    {isSent && (
                      <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground opacity-70">
                        <span>{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <CheckCheck className={`size-3 ${messageIsRead ? 'text-blue-500' : 'text-gray-400'}`} />
                      </div>
                    )}
                  </div>
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