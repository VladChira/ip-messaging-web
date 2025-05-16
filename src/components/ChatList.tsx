"use client";

import { Chat, UserData, ChatDetail } from "@/lib/api";
import { ChatListItem } from "./ChatListItem";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface ChatListProps {
  user: UserData | null;
  chats: Chat[];
  chatDetails: Record<string, ChatDetail>;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export default function ChatList({
  user,
  chats,
  chatDetails,
  selectedChatId,
  onSelectChat,
}: ChatListProps) {
 
  return (
    <ScrollArea className="flex-1 rounded-md border p-2">
      {chats.map((chat, idx) => {
        const detail = chatDetails[chat.chatId] || {
          members: [],
          messages: [],
        };
        console.log(detail)
        const { members, messages } = detail;
        const latest = messages[messages.length - 1];

        // determine display name
        let displayName: string;
        if (chat.chatType === "group") {
          displayName = chat.name || "Group";
        } else {
          // one-on-one: find the other user
          const other = members.find((m) => m.userId !== user?.userId);
          displayName = other?.name || "Unknown";
        }

        const isSelected = chat.chatId === selectedChatId;

        return (
          <div key={chat.chatId}>
            <div
              className={`py-2 rounded-md cursor-pointer ${
                isSelected ? "bg-accent" : "hover:bg-muted"
              }`}
              onClick={() => onSelectChat(chat.chatId)}
            >
              <ChatListItem
                name={displayName}
                avatarUrl="/test.png"
                lastMessage={latest?.text || ""}
                lastMessageTime={
                  latest ? new Date(latest.sentAt).toLocaleTimeString() : ""
                }
                unreadCount={0}
                isRead={false}
              />
            </div>
            {idx !== chats.length - 1 && <Separator />}
          </div>
        );
      })}
    </ScrollArea>
  );
}
