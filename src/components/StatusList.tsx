"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatusListItem } from "./StatusListItem";
import { ChatAppUser, loggedInUserID } from "@/lib/constants";

export function StatusList() {
  const [users, setUsers] = useState<ChatAppUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        "https://c9server.go.ro/messaging-api/get-friends-by-user-id/" +
          loggedInUserID.toString()
      );
      console.log(response);

      const data = await response.json();
      setUsers(data.friends);
    };

    fetchUsers();
  }, []);

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
