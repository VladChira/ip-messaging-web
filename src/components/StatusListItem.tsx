import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StatusListItemProps {
    name: string;
    username: string;
    avatarUrl?: string;
    status: string;
    timestamp: string;
}

export function StatusListItem({
    name,
    status,
    timestamp
}: StatusListItemProps) {
    return (
        <div className="flex items-start gap-3 rounded-md hover:bg-muted cursor-pointer">
            {/* Avatar */}
            <Avatar className="h-10 w-10">
                <AvatarImage src="/avatar.jpg" alt="@user" />
                <AvatarFallback>DJT</AvatarFallback>
            </Avatar>

            {/* Chat Info */}
            <div className="flex-1 w-0">
                <div className="flex justify-between">
                    <p className="font-semibold truncate">{name}</p>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                        {timestamp}
                    </p>
                </div>
                <p className="inline-flex items-center gap-1 text-md text-muted-foreground w-full">
                    {status}
                </p>

            </div>
        </div>
    );
}
