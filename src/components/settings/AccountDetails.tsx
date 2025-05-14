"use client"

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChatAppUser, loggedInUserID } from '@/lib/constants';

export type AccountDetailsProps = {
    showDetails?: boolean;
};

const AccountDetails: React.FC<AccountDetailsProps> = ({ showDetails = false }) => {
    const [user, setUser] = useState<ChatAppUser>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    "https://c9server.go.ro/messaging-api/users"
                );
                
                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();
                setUser(data.users[loggedInUserID]);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError("Could not load user information. Please try again later.");
                // Optionally, you could use a fallback user object here
                // setUser({ name: "Guest User", username: "guest", ... })
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="py-2 p-2 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading user information...</p>
            </div>
        );
    }

    // Show error state
    if (error && !user) {
        return (
            <div className="py-2 p-2">
                <p className="text-sm text-red-500">{error}</p>
            </div>
        );
    }

    // If no user data is available after loading completes
    if (!user) {
        return (
            <div className="py-2 p-2">
                <p className="text-sm text-muted-foreground">User information not available</p>
            </div>
        );
    }

    return (
        <div className="space-y-2 pt-1">
            <div className="py-2 rounded-md hover:bg-muted cursor-pointer pb-5">
                <div className="flex items-start gap-3 rounded-md hover:bg-muted cursor-pointer p-2">
                    <Avatar className="h-13 w-13">
                        <AvatarImage src={'/test'} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold truncate text-lg">{user.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>

                        {showDetails && (
                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Status:</strong> {user.status}</p>
                                <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;