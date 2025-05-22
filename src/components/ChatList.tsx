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
          chatMembers: [],
        };
        const { members, messages, chatMembers } = detail;
        
        // Sort messages to get the actual latest message
        const sortedMessages = [...messages].sort(
          (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );
        const latest = sortedMessages[sortedMessages.length - 1];

        // determine display name
        let displayName: string;
        if (chat.chatType === "group") {
          displayName = chat.name || "Group";
        } else {
          // one-on-one: find the other user (FIX: Convert to strings for comparison)
          const other = members.find((m) => String(m.userId) !== String(user?.userId));
          displayName = other?.name || "Unknown";
        }

        const isSelected = chat.chatId === selectedChatId;
        
        // Check if the latest message was sent by the current user (FIX: Convert to strings)
        const isLastMessageByCurrentUser = Boolean(
          latest && user && String(latest.senderId) === String(user.userId)
        );
        
        // Get the read status from the latest message (if it exists and was sent by current user)
        // const isLastMessageRead = isLastMessageByCurrentUser && latest 
        //   ? isMessageRead(latest, sortedMessages, chatMembers, user?.userId || 0)
        //   : false;

        // Get the sender name for group chats (only if not sent by current user)
        let lastMessageSenderName = "";
        if (latest && chat.chatType === "group" && !isLastMessageByCurrentUser) {
          const sender = members.find((m) => String(m.userId) === String(latest.senderId));
          lastMessageSenderName = sender?.name || sender?.username || `User ${latest.senderId}`;
        }

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
                unreadCount={0} // You can implement this using chat.unreadCount if available
                isRead={false}
                isLastMessageByCurrentUser={isLastMessageByCurrentUser}
                lastMessageSenderName={lastMessageSenderName}
                isGroupChat={chat.chatType === "group"}
              />
            </div>
            {idx !== chats.length - 1 && <Separator />}
          </div>
        );
      })}
    </ScrollArea>
  );
}