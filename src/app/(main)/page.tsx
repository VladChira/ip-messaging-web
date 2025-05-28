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
import { useState, useEffect, useCallback, useRef } from "react";

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      console.log(msg.chatId);
      console.log(selectedChatId);
      if (msg.chatId === selectedChatId) {
        console.log("sending a mark as read");
        sendMarkAsRead(msg.chatId, msg.messageId);
      }

      // Now update unreadCounts:
      setChatsList((prev) => {
        console.log('jere');
        return prev
          .map((chat) => {
            if (chat.chatId !== msg.chatId) return chat;

            // if this chat is open, zero out; otherwise increment (but not for your own messages)
            const isOpen = chat.chatId === selectedChatId;
            const didSendIt = msg.senderId === user.userId;
            const delta = didSendIt ? 0 : 1;
            const newCount = isOpen ? 0 : (chat.unreadCount || 0) + delta;

            return { ...chat, unreadCount: newCount };
          })
      });
    });

    // ▶️ subscribe to refresh
    onRefresh(() => {
      // you'll already have fetchAll() in scope
      console.log("refetching all chats & messages…");
      fetchAll();
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
  }, [user, selectedChatId]);

  // 1️⃣ JOIN / LEAVE: only depends on selectedChatId
  useEffect(() => {
    if (!selectedChatId) return;


    setChatsList((prev) =>
      prev.map((chat) =>
        chat.chatId === selectedChatId
          ? { ...chat, unreadCount: 0 }
          : chat
      )
    );

    joinChat(selectedChatId);
    return () => {
      leaveChat(selectedChatId);
    };
  }, [selectedChatId]);

  // 2️⃣ INITIAL READ‐ALL: only run once per chat open
  const initialReadRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!selectedChatId) return;
    if (!user) return;
    if (initialReadRef.current.has(selectedChatId)) return;

    const detail = chatDetails[selectedChatId];
    detail?.messages.forEach((msg) => {
      if (!msg.seenBy.includes(user.userId)) {
        sendMarkAsRead(selectedChatId, msg.messageId);
      }
    });

    initialReadRef.current.add(selectedChatId);
  }, [selectedChatId, chatDetails]);

  // 3️⃣ CONTINUOUS READ for incoming messages
  useEffect(() => {
    if (!selectedChatId) return;
    if (!user) return;
    const detail = chatDetails[selectedChatId];

    // whenever a NEW message arrives with no seenBy, mark it
    detail?.messages.forEach((msg) => {
      if (msg.senderId !== user?.userId && !msg.seenBy.includes(user.userId)) {
        sendMarkAsRead(selectedChatId, msg.messageId);
      }
    });
  }, [selectedChatId, chatDetails]);


  function handleSendMessage(chatId: string, text: string): void {
    console.log("Sending message:", text, "to chatID:", chatId);
    sendMessage(chatId, text);

    // bump this chat to the top immediately
    setChatsList((prev) => sortChatsByLatest(prev, chatDetails));
  }

  return (
    <div className="flex h-screen w-full p-6 md:flex-row">
      <div
        className={`
              ${selectedChatId ? "hidden" : "flex"}
              md:flex flex-col max-w-md w-full space-y-4
            `}
      >
        <div className="flex items-center justify-between">
          {/* TITLE + STATUS */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Chats</h1>

            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={isSocketConnected ? "outline" : "destructive"}
                  className="gap-1"
                >
                  {isSocketConnected ? (
                    <CheckCircle className="size-5 text-green-500" />
                  ) : (
                    <XCircle className="size-5 text-red-500" />
                  )}
                  <span className="text-sm">
                    {isSocketConnected ? "Online" : "Offline"}
                  </span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isSocketConnected
                  ? "Connected to the chat server"
                  : "You are disconnected"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* ACTION BUTTONS */}
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
      <div
        className={`
    ${!selectedChatId ? "hidden" : "flex"}
    md:flex flex-col flex-1 ml-6 rounded-md bg-muted/10 min-h-0 pb-[calc(4rem+env(safe-area-inset-bottom))]
  `}
      >
        {selectedChatId && (
          <>
            {/* ← Back button only on sm: */}
            <button
              className="md:hidden mb-2 text-blue-500"
              onClick={() => setSelectedChatId(null)}
            >
              ← Back
            </button>
            <CurrentChatPanel
              user={user}
              chat={chatsList.find((c) => c.chatId === selectedChatId)!}
              detail={chatDetails[selectedChatId]!}
              onSendMessage={handleSendMessage}
              isSocketConnected={isSocketConnected}
            />
          </>
        )}
      </div>
    </div>
  );
}
