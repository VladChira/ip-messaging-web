"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatusListItem } from "./StatusListItem";
import { ChatAppUser, getInitials } from "@/lib/constants";
import { AlertCircle } from "lucide-react";
import { friends, getCurrentUser, UserData } from "@/lib/api";

import Cookies from 'js-cookie';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function StatusList() {
  const [users, setUsers] = useState<ChatAppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<UserData | null>(null);

  // Load the current user
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.userId) return;
      try {
        setLoading(true);
        
        const data = await friends.getFriends();
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
  }, [user?.userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 h-40">
        <p className="text-sm text-muted-foreground">
          Loading status updates...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-40 text-center gap-2">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="text-sm text-red-500">{error}</p>
        <p className="text-xs text-muted-foreground">
          Check your connection and try again
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border h-full">
      <div className="py-2 rounded-md hover:bg-muted cursor-pointer">
        <div className="flex items-start gap-3 rounded-md hover:bg-muted cursor-pointer px-2 pt-4">
          <Avatar className="h-13 w-13">
            <AvatarImage alt={user?.name || "User"} />
            <AvatarFallback>{user ? getInitials(user.name) : "?"}</AvatarFallback>
          </Avatar>

          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
              <p className="font-semibold truncate text-lg">{user?.name || "Loading..."}</p>
            </div>
            <p className="text-sm text-muted-foreground truncate">@{user?.username || "user"}</p>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">My current status</h2>
          <p className="text-base text-foreground">{user?.status || "No status set."}</p>
        </div>
      </div>
      <Separator className="mb-4" />
      {users.length > 0 && (
        <>

          <div className="px-4 pb-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Updates from your friends
            </h2>
          </div>
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-2">
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
        </>
      )}

    </div>
  );
}
