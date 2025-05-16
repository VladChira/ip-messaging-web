// lib/socket.js
import { io } from "socket.io-client";

let socket = null;

export function connectSocket(token, userId) {
  if (!socket) {
    socket = io("http://localhost:5000", {
      path: "/messaging-api",
      transports: ["websocket"],
      auth: { token, userId },
    });

    socket.on("connect", () => {
      console.log("⚡️ socket connected", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 socket disconnected:", reason);
    });
  }
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

export function sendMessage(chatId, text, tempId = null) {
  if (socket) {
    socket.emit("send_message", { chatId, text, tempId });
  }
}
