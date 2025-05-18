/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import ChatList from "@/components/ChatList";
import { CurrentChatPanel } from "@/components/CurrentChat";
import { NewChatDialog } from "@/components/NewChatDialog";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { Input } from "@/components/ui/input";
import { UserData, Message, Chat, getCurrentUser, ChatDetail, chats, api, ChatMember } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";

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
  const [chatsList, setChatsList] = useState<Chat[]>([]);
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

  // Define fetchAll as a callback function so we can reuse it for refreshChats
  const fetchAll = useCallback(async () => {
    if (!user?.userId) return;

    try {
      // -- Fetch chats using API function --
      const { chats: fetchedChats } = await chats.getChats();
      setChatsList(fetchedChats);

      // -- Fetch all users once --
      const { users: allUsers }: { users: UserData[] } = await api.get("/users");

      // -- For each chat, fetch messages, members, and chatMembers in parallel --
      const entries = await Promise.all(
        fetchedChats.map(async (chat: Chat) => {
          try {
            // Get messages
            const { messages = [] }: { messages: Message[] } = await chats.getMessages(chat.chatId);
            
            // Get user members (UserData objects)
            const { members: userMembers = [] }: { members: UserData[] } = await chats.getMembers(chat.chatId);
            
            // Get chat members (ChatMember objects with read status)
            const token = Cookies.get("token");
            const chatMembersRes = await fetch(
              `https://c9server.go.ro/messaging-api/get-chat-members/${chat.chatId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            let chatMembers: ChatMember[] = [];
            if (chatMembersRes.ok) {
              const { members: rawChatMembers } = await chatMembersRes.json();
              chatMembers = rawChatMembers || [];
            }

            return [
              chat.chatId,
              {
                members: userMembers,
                messages,
                chatMembers,
              },
            ] as [string, ChatDetail];
          } catch (error) {
            console.error(`Error fetching details for chat ${chat.chatId}:`, error);
            return [
              chat.chatId,
              {
                members: [],
                messages: [],
                chatMembers: [],
              },
            ] as [string, ChatDetail];
          }
        })
      );

      // build map and set state
      setChatDetails(Object.fromEntries(entries));
    } catch (err) {
      console.error("Error loading chat data:", err);
      setChatsList([]);
      setChatDetails({});
    }
  }, [user?.userId]);

  // Function to refresh chats after creating a new group
  const refreshChats = useCallback(() => {
    fetchAll();
  }, [fetchAll]);

  // Fetch chats, users, messages & members in one shot
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 1️⃣ connect once on mount
  useEffect(() => {
    if (!user) return;
    const token = Cookies.get("token");
    // Convert userId to string to match backend expectations
    connectSocket(token, String(user.userId));

    // flip our local flag when socket.io emits
    onConnect(() => setIsSocketConnected(true));
    onDisconnect(() => setIsSocketConnected(false));

    // subscribe to incoming events
    onMessage((msg: any) => {
      console.log("Received new message:", msg);
      setChatDetails(prev => {
        const detail = prev[msg.chatId] ?? { members: [], messages: [], chatMembers: [] };
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
    console.log("Sending message:", text, "to chatID:", chatId);
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
          <div className="flex gap-2">
            <CreateGroupDialog onChatCreated={refreshChats} />
            <NewChatDialog />
          </div>
        </div>

        <Input placeholder="Search chats..."></Input>

        {/* Scrollable Chat List */}
        <ChatList
          user={user}
          chats={chatsList}
          chatDetails={chatDetails}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      </div>
      <div className="flex-1 ml-6 rounded-md bg-muted/10">
        {selectedChatId != null && chatDetails[selectedChatId] && (
          <CurrentChatPanel
            user={user}
            chat={chatsList.find((c) => c.chatId === selectedChatId)!}
            detail={chatDetails[selectedChatId]!}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
}