import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ChatListItem() {
  return (
    <div className="flex items-start gap-3 rounded-md hover:bg-muted cursor-pointer">
      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarImage src="/avatar.jpg" alt="@user" />
        <AvatarFallback>DJT</AvatarFallback>
      </Avatar>

      {/* Chat Info */}
      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-semibold truncate">Donald Trump</p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            2:14 PM
          </p>
        </div>
          <p className="text-sm text-muted-foreground">
            Had denoting properly joint collab...
          </p>
      </div>

      {/* Unread Badge */}
      <div className="ml-1 pt-2">
        <div className="bg-green-500 text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5">
          3
        </div>
      </div>
    </div>
  );
}
