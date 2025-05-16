import { io } from 'socket.io-client';

let socket;

export const initiateSocketConnection = () => {
  socket = io("http://localhost:5000", {
    transports: ["websocket"]
  });

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
