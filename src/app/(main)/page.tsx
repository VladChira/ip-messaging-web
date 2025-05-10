import { ChatListItem } from "@/components/ChatListItem";
import { CurrentChatPanel } from "@/components/CurrentChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CirclePlus } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-full w-full p-6">
      <div className="flex flex-col min-w-[240px] max-w-[360px] w-full space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Chats</h1>
          <Button size="sm" variant="outline">
            <CirclePlus className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>

        <Input placeholder="Search chats..."></Input>

        {/* Scrollable Chat List */}
        <ScrollArea className="flex-1 rounded-md border p-2">
          <div className="space-y-2 pt-1">
            <div className="py-2 rounded-md hover:bg-muted cursor-pointer">
              <ChatListItem />
            </div>
            <Separator />
            <div className="py-2 rounded-md hover:bg-muted cursor-pointer">
              <ChatListItem />
            </div>
            <Separator />
            <div className="py-2 rounded-md hover:bg-muted cursor-pointer">
              <ChatListItem />
            </div>
            <Separator />
          </div>
        </ScrollArea>
      </div>
      <div className="flex-1 ml-6 rounded-md bg-muted/10">
        <CurrentChatPanel />
      </div>
    </div>
  );
}
