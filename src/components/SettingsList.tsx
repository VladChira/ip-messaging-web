"use client";

import { CircleHelp, KeyRound, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import Link from "next/link";
// Removed the Button import since it's no longer used
import { useEffect, useState } from "react";
import { auth, getCurrentUser, UserData } from "@/lib/api";
import { useRouter } from "next/navigation";
import { getInitials } from "@/lib/constants";

const SettingsList = () => {
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

    const handleLogout = () => {
        // Call the logout function from auth
        auth.logout();
        
        // Redirect to login page
        router.push("/login");
    };

    return (
        <div className="flex-1 p-2">
            <div className="space-y-2 pt-1">
                <div className="py-2 rounded-md hover:bg-muted cursor-pointer pb-5">
                    <div className="flex items-start gap-3 rounded-md hover:bg-muted cursor-pointer p-2">
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
                </div>

                <Separator className="my-3" />

                <div className="rounded-md hover:bg-muted cursor-pointer">
                    <Link href="/settings/account">
                        <div className="flex items-center gap-3 rounded-md hover:bg-muted cursor-pointer p-2">
                            <KeyRound className="size-7" strokeWidth={1.6} />

                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold truncate text-lg">Account</p>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">Account info, delete account</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <Separator />

                <div className="rounded-md hover:bg-muted cursor-pointer">
                    <Link href="/settings/help">
                        <div className="flex items-center gap-3 rounded-md hover:bg-muted cursor-pointer p-2">
                            <CircleHelp className="size-7" strokeWidth={1.6} />

                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold truncate text-lg">Help</p>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">Help center, contact devs, privacy policy</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <Separator />

                {/* Logout button row */}
                <div 
                    className="py-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={handleLogout}
                >
                    <div className="flex items-center gap-3 rounded-md hover:bg-muted cursor-pointer p-2">
                        <LogOut className="size-7" strokeWidth={1.6} color="#cc2a1f" />

                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold truncate text-lg">Log out</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />
            </div>
        </div>
    );
}

export default SettingsList;