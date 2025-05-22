// lib/socket.js
import { io } from "socket.io-client";

let socket = null;

// Base URL for all websocket requests
const WS_BASE_URL = "https://c9server.go.ro";
// const WS_BASE_URL = "http://localhost:5000";

export function connectSocket(token, userId) {
  if (!socket) {
    socket = io(WS_BASE_URL, {
      path: "/messaging-api/socket.io",     // must match your server’s path
      transports: ["polling", "websocket"],  // allow polling first, then upgrade
      forceNew: true,                        // create a new Manager per tab
      auth: { token, userId },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socket.on("connect", () => {
      console.log("⚡️ socket connected", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 socket disconnected:", reason);
    });
  }
}

export function onConnect(cb) {
  socket?.on("connect", cb);
}
export function onDisconnect(cb) {
  socket?.on("disconnect", cb);
}


export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinChat(chatId) {
  if (socket) {
    console.log("→ joining chat", chatId);
    socket.emit("join_chat", { chatId });
  }
}

export function leaveChat(chatId) {
  if (socket) {
    console.log("← leaving chat", chatId);
    socket.emit("leave_chat", { chatId });
  }
}

export function onMessage(cb) {
  if (socket) {
    socket.on("message", (msg) => {
      console.log("📨 message event:", msg);
      cb(msg);
    });
  }
}

export function onTyping(cb) {
  if (socket) {
    socket.on("typing", (data) => {
      console.log("✍️ typing event:", data);
      cb(data);
    });
  }
}

export function onPresence(cb) {
  if (socket) {
    socket.on("presence_update", (data) => {
      console.log("👥 presence_update:", data);
      cb(data);
    });
  }
}

export function onMarkAsRead(cb) {
  if (socket) {
    socket.on("mark_as_read", (data) => {
      console.log("mark_as_read:", data);
      cb(data);
    });
  }
}

export function sendMessage(chatId, text, tempId = null) {
  if (socket) {
    socket.emit("send_message", { chatId, text, tempId });
  }
}

export function sendMarkAsRead(chatId, messageId) {
  socket.emit("mark_as_read", { chatId, messageId });
}

