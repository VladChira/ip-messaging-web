// components/FriendRequestsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/constants";
import { AlertCircle, UserPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { getCurrentUser } from "@/lib/api";

interface FriendRequest {
  requestId: number;
  userId: number;
  name: string;
  username: string;
  createdAt: string;
}

// Define proper interface for API response
interface FriendRequestAPIResponse {
  incoming_pending: Array<{
    requestId: number;
    senderId: number;
    receiverId: number;
    status: string;
    createdAt: string;
    senderName: string;  // Now these will be provided by the backend
    senderUsername: string;
  }>;
  outgoing_pending: Array<{
    requestId: number;
    senderId: number;
    receiverId: number;
    status: string;
    createdAt: string;
  }>;
}

const FriendRequestsTab = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          throw new Error("You must be logged in to view friend requests");
        }
        
        // Call the real API endpoint
        const response = await fetch(
          `https://c9server.go.ro/messaging-api/get-friend-requests/${currentUser.userId}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json() as FriendRequestAPIResponse;
        
        // Process incoming requests
        const incomingRequests = data.incoming_pending.map((req) => {
            return {
                requestId: req.requestId,
                userId: req.senderId,
                name: req.senderName, // No fallback needed now
                username: req.senderUsername, // No fallback needed now
                createdAt: req.createdAt
            };
        });
        
        setRequests(incomingRequests);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch friend requests:", err);
        setError("Could not load friend requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleResponse = async (requestId: number, action: 'accept' | 'reject') => {
    try {
      setActionInProgress(requestId);
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to respond to friend requests");
      }
      
      const endpoint = action === 'accept' ? 
        'accept-friend-request' : 'reject-friend-request';
      
      // Call the real API endpoint
      const response = await fetch(`https://c9server.go.ro/messaging-api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ 
          requestId: requestId, 
          [action === 'accept' ? 'accepterId' : 'rejecterId']: currentUser.userId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} friend request`);
      }
      
      // Remove the request from the list
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.requestId !== requestId)
      );
      
      // Show notification
      if (action === 'accept') {
        toast?.success("Friend request accepted", {
          description: "You are now friends with this user."
        });
      } else {
        toast?.info("Friend request declined");
      }
    } catch (err) {
      console.error(`Failed to ${action} friend request:`, err);
      
      toast?.error(`Failed to ${action} friend request`, {
        description: err instanceof Error ? err.message : "Please try again."
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Rest of the component remains the same...
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-muted-foreground">Loading friend requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center gap-2">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="text-sm text-red-500">{error}</p>
        <p className="text-xs text-muted-foreground">
          Check your connection and try again
        </p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center gap-2">
        <UserPlus className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No pending friend requests
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request, index) => (
        <div key={request.requestId}>
          <div className="flex items-start gap-3 p-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/user-${request.userId}.png`} alt={`@${request.username}`} />
              <AvatarFallback>{getInitials(request.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="font-semibold truncate">{request.name}</p>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                @{request.username}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={actionInProgress !== null}
                onClick={() => handleResponse(request.requestId, 'accept')}
              >
                {actionInProgress === request.requestId ? "Processing..." : "Accept"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={actionInProgress !== null}
                onClick={() => handleResponse(request.requestId, 'reject')}
              >
                Decline
              </Button>
            </div>
          </div>
          {index !== requests.length - 1 && <Separator className="my-3" />}
        </div>
      ))}
    </div>
  );
};

export default FriendRequestsTab;