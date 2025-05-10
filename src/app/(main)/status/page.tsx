import { ScrollArea } from "@/components/ui/scroll-area";
import { CirclePlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StatusListItem } from "@/components/StatusListItem";

export default function StatusPage() {
    return (
        <div className="flex h-full w-full p-6">
            <div className="flex flex-col max-w-xl w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Status updates</h1>
                    <Button size="lg" variant="outline">
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Update your status
                    </Button>
                </div>

                {/* Scrollable Chat List */}
                <ScrollArea className="flex-1 rounded-md border p-2">
                    <div className="space-y-2 pt-1">
                        <div className="py-2 rounded-md hover:bg-muted cursor-pointer">
                            <StatusListItem name="Vlad Chira" username="vchira" avatarUrl="/vc.png" timestamp="14:15" status="I am feeling tired 🫨" />
                        </div>
                        <Separator className="my-3" />
                        <div className="py-2 rounded-md hover:bg-muted cursor-pointer">
                            <StatusListItem name="Victor Moisa" username="vektor" avatarUrl="/vc.png" timestamp="10:11" status="What a wonderful week this has been 🤪" />
                        </div>
                        <Separator />
                        <div className="py-2 rounded-md hover:bg-muted cursor-pointer">
                            <StatusListItem name="Andrei Ionita" username="aionita" avatarUrl="/vc.png" timestamp="9:01" status="I love nextjs" />
                        </div>
                        <Separator />
                    </div>
                </ScrollArea>
            </div>
            {/* Right: Placeholder */}
            <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
                <CirclePlus className="h-15 w-15 mb-2" />
                <p className="text-center">Share what&apos;s going on by creating a status update!</p>
            </div>
        </div>
    );
}
