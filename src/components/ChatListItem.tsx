import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/constants";
import { CheckCheck } from "lucide-react";

export function ChatListItem({
  name,
  avatarUrl,
  lastMessage,
  lastMessageTime,
  unreadCount,
  isRead,
  isLastMessageByCurrentUser,
  lastMessageSenderName,
  isGroupChat,
}: {
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageTime: string; // already formatted like "2:14 PM"
  unreadCount: number;
  isRead: boolean;
  isLastMessageByCurrentUser: boolean;
  lastMessageSenderName?: string;
  isGroupChat?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md hover:bg-muted cursor-pointer px-2 py-2">
      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl || "/avatar.jpg"} alt={`@${name}`} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>

      {/* Chat Info */}
      <div className="flex-1 w-0">
        <div className="flex justify-between">
          <p className="font-semibold truncate">{name}</p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {lastMessageTime}
          </p>
        </div>
        <p className="inline-flex items-center gap-1 text-sm text-muted-foreground truncate w-full">
          {/* Only show double ticks if the last message was sent by the current user */}
          {isLastMessageByCurrentUser && (
            <CheckCheck className={`size-4 shrink-0 ${isRead ? 'text-blue-500' : 'text-gray-400'}`} />
          )}
          <span className="truncate">
            {/* Show sender name in group chats for messages not sent by current user */}
            {isGroupChat && lastMessageSenderName && (
              <span className="font-medium">
                {lastMessageSenderName}:{" "}
              </span>
            )}
            {lastMessage}
          </span>
        </p>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className="ml-1 pt-2">
          <div className="bg-green-500 text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5">
            {unreadCount}
          </div>
        </div>
      )}
    </div>
  );
}