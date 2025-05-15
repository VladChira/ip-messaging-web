"use client"

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getCurrentUser, UserData } from '@/lib/api';
import { useRouter } from 'next/navigation';

export type AccountDetailsProps = {
    showDetails?: boolean;
};

const AccountDetails: React.FC<AccountDetailsProps> = ({ showDetails = false }) => {
    const router = useRouter();

    const [user, setUser] = useState<UserData | null>(null);

    // Get the current user on component mount
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        // If no user is found, redirect to login
        if (!currentUser) {
            router.push("/login");
        }
    }, [router]);

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