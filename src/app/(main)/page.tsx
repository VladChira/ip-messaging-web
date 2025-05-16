/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import ChatList from "@/components/ChatList";
import { CurrentChatPanel } from "@/components/CurrentChat";
import { NewChatDialog } from "@/components/NewChatDialog";
import { Input } from "@/components/ui/input";
import { UserData, Message, Chat, getCurrentUser, ChatDetail } from "@/lib/api";
import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import {
  connectSocket,
  onMessage,
  onTyping,
  onPresence,
  disconnectSocket,
  leaveChat,
  joinChat,
  sendMessage,
  onConnect,
  onDisconnect,
} from "@/lib/socket";

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatDetails, setChatDetails] = useState<Record<string, ChatDetail>>(
    {}
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Load current user once
  useEffect(() => {
    const me = getCurrentUser();
    setUser(me);
  }, []);

  // Fetch chats, users, messages & members in one shot
  useEffect(() => {
    if (!user?.userId) return;

    const token = Cookies.get("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        // -- Fetch chats --
        const chatRes = await fetch(
          "https://c9server.go.ro/messaging-api/get-chats",
          { headers }
        );
        if (!chatRes.ok) throw new Error("Could not load chats");
        const { chats: fetchedChats } = await chatRes.json();
        setChats(fetchedChats);

        // -- Fetch all users once --
        const usersRes = await fetch(
          "https://c9server.go.ro/messaging-api/users",
          { headers }
        );
        if (!usersRes.ok) throw new Error("Could not load users");
        const { users: allUsers }: { users: UserData[] } =
          await usersRes.json();

        // -- For each chat, fetch messages & members in parallel --
        const entries = await Promise.all(
          fetchedChats.map(async (chat: { chatId: string }) => {
            // messages
            const msgRes = await fetch(
              `https://c9server.go.ro/messaging-api/get-messages/${chat.chatId}`,
              { headers }
            );
            const { messages = [] }: { messages: Message[] } = msgRes.ok
              ? await msgRes.json()
              : { messages: [] };

            // members
            const memRes = await fetch(
              `https://c9server.go.ro/messaging-api/get-members/${chat.chatId}`,
              { headers }
            );
            const {
              members: rawMembers = [],
            }: {
              members: { userId: number }[];
            } = memRes.ok ? await memRes.json() : { members: [] };

            // resolve user data
            const members = rawMembers
              .map((m) => allUsers.find((u) => u.userId === m.userId) ?? null)
              .filter((u): u is UserData => u !== null);

            return [
              chat.chatId,
              {
                members,
                messages,
              },
            ] as [string, ChatDetail];
          })
        );

        // build map and set state
        setChatDetails(Object.fromEntries(entries));
      } catch (err) {
        console.error("Error loading chat data:", err);
        setChats([]);
        setChatDetails({});
      }
    };

    fetchAll();
  }, [user?.userId]);

  // 1️⃣ connect once on mount
  useEffect(() => {
    if (!user) return;
    const token = Cookies.get("token");
    connectSocket(token, user?.userId);

    // flip our local flag when socket.io emits
    onConnect(() => setIsSocketConnected(true));
    onDisconnect(() => setIsSocketConnected(false));

    // subscribe to incoming events
    onMessage((msg: any) => {
      setChatDetails(prev => {
        const detail = prev[msg.chatId] ?? { members: [], messages: [] };
        return {
          ...prev,
          [msg.chatId]: {
            ...detail,
            messages: [...detail.messages, msg],
          },
        };
      });
    });
    onTyping((data: any) => {
      /* console.log already in socket.js */
    });
    onPresence((data: any) => {
      /* console.log already in socket.js */
    });

    return () => {
      disconnectSocket();
    };
  }, [user]);

  // 2️⃣ join / leave rooms when selection changes
  useEffect(() => {
    if (selectedChatId) {
      joinChat(selectedChatId);
    }
    return () => {
      if (selectedChatId) leaveChat(selectedChatId);
    };
  }, [selectedChatId]);

  function handleSendMessage(chatId: string, text: string): void {
    console.log("Sent message " + text + " from chatID " + chatId);
    sendMessage(chatId, text);
  }

  return (
    <div className="flex h-full w-full p-6">
      <div className="flex flex-col max-w-md w-full space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Chats</h1>
          <span
            className={`
              h-3 w-3 rounded-full
              ${isSocketConnected ? "bg-green-500" : "bg-red-500"}
            `}
            title={isSocketConnected ? "Connected" : "Disconnected"}
          />
          <NewChatDialog />
        </div>

        <Input placeholder="Search chats..."></Input>

        {/* Scrollable Chat List */}
        <ChatList
          user={user}
          chats={chats}
          chatDetails={chatDetails}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      </div>
      <div className="flex-1 ml-6 rounded-md bg-muted/10">
        {selectedChatId != null && (
          <CurrentChatPanel
            user={user}
            chat={chats.find((c) => c.chatId === selectedChatId)!}
            detail={chatDetails[selectedChatId]!}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
}
