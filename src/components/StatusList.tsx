"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatusListItem } from "./StatusListItem";
import { ChatAppUser, loggedInUserID } from "@/lib/constants";
import { AlertCircle } from "lucide-react";

export function StatusList() {
  const [users, setUsers] = useState<ChatAppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://c9server.go.ro/messaging-api/get-friends-by-user-id/" +
            loggedInUserID.toString()
        );
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data.friends || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        setError("Could not load friend statuses. Please try again later.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 h-40">
        <p className="text-sm text-muted-foreground">Loading status updates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-40 text-center gap-2">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="text-sm text-red-500">{error}</p>
        <p className="text-xs text-muted-foreground">Check your connection and try again</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 h-40">
        <p className="text-sm text-muted-foreground">No status updates to show</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 rounded-md border p-2">
      <div className="space-y-2 pt-1">
        {users.map((user, index) => (
          <div key={user.userId}>
            <div className="py-2 rounded-md hover:bg-muted cursor-pointer">
              <StatusListItem
                name={user.name}
                username={user.username}
                avatarUrl="/vc.png"
                timestamp={new Date(user.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                status={user.status}
              />
            </div>
            {index !== users.length - 1 && <Separator className="my-3" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}