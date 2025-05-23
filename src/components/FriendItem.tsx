import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/constants";

interface FriendListItemProps {
    name: string;
    username: string;
    avatarUrl?: string;
}

export function FriendListItem({
    name,
    username,
    avatarUrl,
}: FriendListItemProps) {
    const initials = getInitials(name);

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
                >
                    Start chat
                </Button>
            </div>
        </div>
    );
}
