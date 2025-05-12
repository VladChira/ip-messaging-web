"use client";

import { FriendListItem } from "../FriendItem";
import { useEffect, useState } from "react";
import { ChatAppUser, loggedInUserID } from "@/lib/constants";
import { Separator } from "./separator";
import { HeartCrack } from "lucide-react";

const YourFriendsTab = () => {
  const [friends, setFriends] = useState<ChatAppUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        "https://c9server.go.ro/messaging-api/get-friends-by-user-id/" +
          loggedInUserID.toString()
      );

      const data = await response.json();
      setFriends(data.friends);
    };

    fetchUsers();
  }, []);

  return (
    <>
      {friends.length == 0 ? (
        <div className="flex flex-row min-h-screen justify-center items-center">
          <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
            <HeartCrack className="h-15 w-15 mb-2" />
            <p className="text-center">
              No one here yet? Add some friends to get started.
            </p>
          </div>
        </div>
      ) : (
        friends.map((friendUser, index) => (
          <div key={friendUser.userId}>
            <FriendListItem
              name={friendUser.name}
              username={friendUser.username}
              avatarUrl="/tbd"
            />
            {index !== friends.length - 1 && <Separator className="my-3" />}
          </div>
        ))
      )}
    </>
  );
};

export default YourFriendsTab;
