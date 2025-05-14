"use client";

import { FriendListItem } from "../FriendItem";
import { useEffect, useState } from "react";
import { ChatAppUser, loggedInUserID } from "@/lib/constants";
import { Separator } from "./separator";
import { HeartCrack, AlertCircle } from "lucide-react";

const YourFriendsTab = () => {
  const [friends, setFriends] = useState<ChatAppUser[]>([]);
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
        setFriends(data.friends || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        setError("Could not load friends list. Please try again later.");
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-muted-foreground">Loading your friends...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center gap-2">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="text-sm text-red-500">{error}</p>
        <p className="text-xs text-muted-foreground">Check your connection and try again</p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
          <HeartCrack className="h-15 w-15 mb-2" />
          <p className="text-center">
            No one here yet? Add some friends to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {friends.map((friendUser, index) => (
        <div key={friendUser.userId}>
          <FriendListItem
            name={friendUser.name}
            username={friendUser.username}
            avatarUrl="/tbd"
          />
          {index !== friends.length - 1 && <Separator className="my-3" />}
        </div>
      ))}
    </>
  );
};

export default YourFriendsTab;