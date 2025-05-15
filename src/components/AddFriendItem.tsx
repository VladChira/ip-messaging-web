// components/AddFriendItem.tsx
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/constants";
import { toast } from "sonner"; // Import if you've added Sonner
import Cookies from "js-cookie";
import { getCurrentUser } from "@/lib/api";

interface AddFriendListItemProps {
    userId: number;
    name: string;
    username: string;
    avatarUrl?: string;
    requestSent: boolean;
    onRequestSent?: (userId: number) => void;
}

export function AddFriendListItem({
    userId,
    name,
    username,
    avatarUrl,
    requestSent,
    onRequestSent,
}: AddFriendListItemProps) {
    const initials = getInitials(name);
    const [sending, setSending] = useState(false);
    const [isRequestSent, setIsRequestSent] = useState(requestSent);
    const [error, setError] = useState<string | null>(null);

    const handleSendRequest = async () => {
        try {
            setSending(true);
            setError(null);
            
            const currentUser = getCurrentUser();
            if (!currentUser) {
                throw new Error("You must be logged in to send friend requests");
            }
            
            // Call the real API endpoint
            const response = await fetch("https://c9server.go.ro/messaging-api/send-friend-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
                body: JSON.stringify({ 
                    senderId: currentUser.userId, 
                    receiverId: userId 
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send friend request");
            }
            
            setIsRequestSent(true);
            onRequestSent?.(userId);
            
            // Show a notification
            toast?.success("Friend request sent", {
                description: `A friend request has been sent to ${name}.`
            });
        } catch (err) {
            console.error("Failed to send friend request:", err);
            setError(err instanceof Error ? err.message : "Failed to send request");
            
            toast?.error("Failed to send request", {
                description: err instanceof Error ? err.message : "Please try again."
            });
        } finally {
            setSending(false);
        }
    };

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
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <div className="ml-1 pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isRequestSent || sending}
                    onClick={isRequestSent ? undefined : handleSendRequest}
                >
                    {sending ? "Sending..." : isRequestSent ? "Friend Request Sent" : "Send Friend Request"}
                </Button>
            </div>
        </div>
    );
}