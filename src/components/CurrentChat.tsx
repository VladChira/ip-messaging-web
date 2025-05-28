"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
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

import { Chat, UserData, Message, ChatMember } from "@/lib/api";
import { getInitials } from "@/lib/constants";
import { onTyping, sendStartedTyping, sendStoppedTyping } from "@/lib/socket";

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
  isSocketConnected: boolean;
}

export function CurrentChatPanel({
  user,
  chat,
  detail,
  onSendMessage,
  isSocketConnected
}: CurrentChatPanelProps) {
  const [inputText, setInputText] = useState("");

  // track which users are typing in this chat
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());

  // debounce timer for “stopped_typing”
  const stopTypingTimeout = useRef<NodeJS.Timeout | null>(null);
  const isTypingSent = useRef(false);

  // 1️⃣ when input changes, tell server “I started typing”
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!isTypingSent.current) {
      sendStartedTyping(chat.chatId);
      console.log('sent start type');
      isTypingSent.current = true;
    }
    // reset our “stopped_typing” timer
    if (stopTypingTimeout.current) clearTimeout(stopTypingTimeout.current);
    stopTypingTimeout.current = setTimeout(() => {
      sendStoppedTyping(chat.chatId);
      console.log('sent stop type');
      isTypingSent.current = false;
    }, 2000);
  };

  // 2️⃣ when component unmounts, clean up
  useEffect(() => {
    return () => {
      if (stopTypingTimeout.current) clearTimeout(stopTypingTimeout.current);
      if (isTypingSent.current) {
        sendStoppedTyping(chat.chatId);
      }
    };
  }, [isSocketConnected, chat.chatId]);

  // 3️⃣ subscribe to “typing” events for this chat
  useEffect(() => {
    if (!isSocketConnected) return;
    const handleTyping = (data: {
      chatId: string;
      userId: number;
      typing: boolean;
    }) => {
      console.log('setting typing users');
      if (data.chatId !== chat.chatId) return;
      
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (data.typing) next.add(data.userId);
        else next.delete(data.userId);
        return next;
      });
    };

    onTyping(handleTyping);
    // if you have an offTyping, unsubscribe on cleanup:
    // return () => offTyping(handleTyping);
  }, [chat.chatId]);


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

  const messages = detail.messages

  function isSeenByAll(msg: Message, members: ChatMember[]) {
    // console.log(msg);
    return members
      .filter(m => m.userId !== msg.senderId)
      .every(m => msg.seenBy.includes(m.userId));
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0">
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
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <ChatMessageList>
          {messages.map((msg) => {
            // console.log(msg);
            const isSent = String(msg.senderId) === String(user?.userId);

            // Find the message author in members
            const author = detail.members.find(
              (m) => String(m.userId) === String(msg.senderId)
            );

            // Get initials and sender name
            let fallbackInitials = "?";
            let senderName = "";

            if (author && author.name) {
              fallbackInitials = getInitials(author.name);
              senderName = author.name;
            } else if (author && author.username) {
              fallbackInitials = getInitials(author.username);
              senderName = author.username;
            } else if (isSent && user?.name) {
              // If it's the current user's message and we can't find the author, use current user's initials
              fallbackInitials = getInitials(user.name);
              senderName = user.name;
            } else if (isSent && user?.username) {
              // Fallback to username if name not available
              fallbackInitials = getInitials(user.username);
              senderName = user.username;
            } else {
              // Last resort: use the first two characters of senderId
              fallbackInitials = String(msg.senderId).slice(0, 2).toUpperCase();
              senderName = `User ${msg.senderId}`;
            }

            // Check if message is read (only for sent messages)
            const messageIsRead = isSent
              ? isSeenByAll(msg, detail.chatMembers)
              : false;

            return (
              <ChatBubble
                key={msg.messageId}
                variant={isSent ? "sent" : "received"}
              >
                <ChatBubbleAvatar fallback={fallbackInitials} />
                <ChatBubbleMessage variant={isSent ? "sent" : "received"}>
                  <div className="flex flex-col gap-1">
                    {/* Add sender name for group chats on received messages */}
                    {!isSent && chat.chatType === "group" && (
                      <span className="text-xs font-semibold text-muted-foreground">
                        {senderName}
                      </span>
                    )}
                    <span>{msg.text}</span>
                    {/* Show double ticks and timestamp for sent messages */}
                    {isSent && (
                      <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground opacity-70">
                        <span>{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <CheckCheck className={`size-4 ${messageIsRead ? 'text-blue-500' : 'text-gray-400'}`} />
                      </div>
                    )}
                  </div>
                </ChatBubbleMessage>
              </ChatBubble>
            );
          })}

          {Array.from(typingUsers)
            .filter((uid) => String(uid) !== String(user?.userId))
            .map((uid) => {
              console.log("uid below");
              console.log(uid);
              console.log('member below')
              
              const member = detail.members.find((m) => m.userId == uid);
              console.log(member)
              const initials = member
                ? getInitials(member.name || member.username || "")
                : "?";
              return (
                <ChatBubble key={`typing-${uid}`} variant="received">
                  <ChatBubbleAvatar fallback={initials} />
                  <ChatBubbleMessage isLoading />
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
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button size="icon" variant="outline" onClick={handleSend}>
          <Send className="size-5" />
        </Button>
      </div>
    </div>
  );
}