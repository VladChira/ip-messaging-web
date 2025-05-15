"use client"

import { CirclePlus } from "lucide-react";
import { StatusList } from "@/components/StatusList";
import UpdateStatusDialog from "@/components/UpdateStatusDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/constants";
import { Separator } from "@radix-ui/react-separator";

export default function StatusPage() {
    return (
        <div className="flex h-full w-full p-6">
            <div className="flex flex-col max-w-xl w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Status updates</h1>
                    <UpdateStatusDialog />
                </div>

                {/* Scrollable Chat List */}
                <StatusList />
            </div>
            {/* Right: Placeholder */}
            <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
                <CirclePlus className="h-15 w-15 mb-2" />
                <p className="text-center">Share what&apos;s going on by creating a status update for your friends to see!</p>
            </div>
        </div>
    );
}
