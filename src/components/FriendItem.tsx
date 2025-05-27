import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { chats } from "@/lib/api";
import { getInitials } from "@/lib/constants";

interface FriendListItemProps {
    name: string;
    username: string;
    avatarUrl?: string;
    friendId: number;
}

export function FriendListItem({
    name,
    username,
    avatarUrl,
    friendId
}: FriendListItemProps) {
    const initials = getInitials(name);

    const handleStartChat = async (userId: number) => {
        console.log(`Starting chat with user ID: ${userId}`);
        try {
              const data = await chats.createChat("one_on_one", "test-one", [userId]);
              console.log("Created one on one chat:", data);
            } catch(err) {
              console.log("Failed to create one on one chat", err);
            }
    }

    return (
        <div className="flex items-start gap-3 rounded-md hover:bg-muted cursor-pointer p-2">
            <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} alt={`@${username}`} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{name}</p>
                </div>
                <p className="text-sm text-muted-foreground truncate">@{username}</p>
            </div>

            <div className="ml-1 pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartChat(friendId)}
                >
                    Start chat
                </Button>
            </div>
        </div>
    );
}
