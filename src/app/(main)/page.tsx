/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import ChatList from "@/components/ChatList";
import { CurrentChatPanel } from "@/components/CurrentChat";
import { NewChatDialog } from "@/components/NewChatDialog";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { Input } from "@/components/ui/input";
import {
  UserData,
  Message,
  Chat,
  getCurrentUser,
  ChatDetail,
  chats,
  api,
  ChatMember,
} from "@/lib/api";
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
  sendMarkAsRead,
  onMarkAsRead,
  onRefresh,
} from "@/lib/socket";

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null);
  const [chatsList, setChatsList] = useState<Chat[]>([]);
  const [chatDetails, setChatDetails] = useState<Record<string, ChatDetail>>(
    {}
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // helper: sort chats by latest message timestamp
  const sortChatsByLatest = useCallback(
    (chatsArr: Chat[], details: Record<string, ChatDetail>) => {
      return [...chatsArr].sort((a, b) => {
        const aMsgs = details[a.chatId]?.messages;
        const bMsgs = details[b.chatId]?.messages;
        const aLatest = aMsgs?.length
          ? new Date(aMsgs[aMsgs.length - 1].sentAt).getTime()
          : 0;
        const bLatest = bMsgs?.length
          ? new Date(bMsgs[bMsgs.length - 1].sentAt).getTime()
          : 0;
        return bLatest - aLatest;
      });
    },
    []
  );

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
      console.log(fetchedChats);
      setChatsList(fetchedChats);

      // -- For each chat, fetch messages, members, and chatMembers in parallel --
      const entries = await Promise.all(
        fetchedChats.map(async (chat: Chat) => {
          try {
            // Get messages
            const { messages = [] }: { messages: Message[] } =
              await chats.getMessages(chat.chatId);

            // Get user members (UserData objects)
            const { members: userMembers = [] }: { members: UserData[] } =
              await chats.getMembers(chat.chatId);

            const { members: chatMembers = [] }: { members: ChatMember[] } =
              await chats.getChatMembers(chat.chatId);
            return [
              chat.chatId,
              {
                members: userMembers,
                messages,
                chatMembers,
              },
            ] as [string, ChatDetail];
          } catch (error) {
            console.error(
              `Error fetching details for chat ${chat.chatId}:`,
              error
            );
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
      const detailsMap = Object.fromEntries(entries);

      setChatDetails(detailsMap);

      setChatsList(sortChatsByLatest(fetchedChats, detailsMap));
    } catch (err) {
      console.error("Error loading chat data:", err);
      setChatsList([]);
      setChatDetails({});
    }
  }, [user?.userId, sortChatsByLatest]);

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
      setChatDetails((prev) => {
        const detail = prev[msg.chatId] ?? {
          members: [],
          messages: [],
          chatMembers: [],
        };
        return {
          ...prev,
          [msg.chatId]: {
            ...detail,
            messages: [...detail.messages, msg],
          },
        };
      });
      // also re-sort chat list after incoming message
      setChatsList((prev) =>
        sortChatsByLatest(prev, {
          ...chatDetails,
          [msg.chatId]: {
            ...chatDetails[msg.chatId],
            messages: [...(chatDetails[msg.chatId]?.messages || []), msg],
          },
        })
      );

      // if this message is in the chat the user currently has open, tell server it’s read
      if (msg.chatId === selectedChatId) {
        console.log("sending a mark as read");
        sendMarkAsRead(msg.chatId, msg.messageId);
      }
    });

    // ▶️ subscribe to refresh
    onRefresh(() => {
      // you'll already have fetchAll() in scope
      console.log("refetching all chats & messages…");
      fetchAll();
    });

    onTyping((data: any) => {
      /* console.log already in socket.js */
    });
    onPresence((data: any) => {
      /* console.log already in socket.js */
    });

    onMarkAsRead(
      (data: { chatId: string; messageId: string; userId: number }) => {
        setChatDetails((prev) => {
          const detail = prev[data.chatId];
          if (!detail) return prev;

          const updated = detail.messages.map((msg) => {
            if (msg.messageId === data.messageId) {
              // only add if not already present
              if (!msg.seenBy.includes(data.userId)) {
                return {
                  ...msg,
                  seenBy: [...msg.seenBy, data.userId],
                };
              }
            }
            return msg;
          });

          return {
            ...prev,
            [data.chatId]: {
              ...detail,
              messages: updated,
            },
          };
        });
      }
    );

    return () => {
      disconnectSocket();
    };
  }, [user, selectedChatId, chatDetails, sortChatsByLatest, fetchAll]);

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

    // bump this chat to the top immediately
    setChatsList((prev) => sortChatsByLatest(prev, chatDetails));
  }

  return (
    <div className="flex h-screen w-full p-6">
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
      <div className="flex flex-col flex-1 ml-6 rounded-md bg-muted/10 min-h-0">
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
