"use client"

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChatAppUser, loggedInUserID } from '@/lib/constants';

export type AccountDetailsProps = {
    showDetails?: boolean;
};

const AccountDetails: React.FC<AccountDetailsProps> = ({ showDetails = false }) => {
    const [user, setUser] = useState<ChatAppUser>();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(
                "https://c9server.go.ro/messaging-api/users"
            );

            const data = await response.json();
            setUser(data.users[loggedInUserID]);
        };

        fetchUsers();
    }, []);

    if (!user) return null;

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
