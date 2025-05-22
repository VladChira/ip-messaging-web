// components/SearchUsersTab.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { AddFriendListItem } from "@/components/AddFriendItem";
import { Separator } from "@/components/ui/separator";
import { Search, AlertCircle } from "lucide-react";
import Cookies from "js-cookie";
import { friends } from "@/lib/api";

interface UserSearchResult {
  userId: number;
  name: string;
  username: string;
  requestSent: boolean;
}

const SearchUsersTab = () => {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Search users when debounced query changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedQuery.trim().length < 2) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await friends.searchUsers(encodeURIComponent(debouncedQuery));
        setUsers(data.users || []);
      } catch (err) {
        console.error("Failed to search users:", err);
        setError("Failed to search users. Please try again.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery]);

  const handleRequestSent = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === userId ? { ...user, requestSent: true } : user
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for users by name or username..."
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <p className="text-sm text-muted-foreground">Searching users...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-500 p-2">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && users.length === 0 && debouncedQuery.trim().length >= 2 && (
        <div className="flex justify-center py-4">
          <p className="text-sm text-muted-foreground">No users found</p>
        </div>
      )}

      <div className="space-y-2">
        {users.map((user, index) => (
          <div key={user.userId}>
            <AddFriendListItem
              userId={user.userId}
              name={user.name}
              username={user.username}
              avatarUrl={`/user-${user.userId}.png`} // You might want to update this with real avatars
              requestSent={user.requestSent}
              onRequestSent={handleRequestSent}
            />
            {index < users.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchUsersTab;