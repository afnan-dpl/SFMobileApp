import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://192.168.1.4:3000"; 





let socket: Socket | null = null;

export const connectSocket = (serverUrl: string): Socket => {
  if (!socket) {
    socket = io(serverUrl, {
      transports: ["websocket"], // ensure WebSocket instead of polling
    });

    socket.on("connection", (socket) => {
        console.log("✅ Client connected:", socket.id);
      });

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server:", serverUrl);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error Afnan :", err.message);
    });
  }
  return socket;
};

export const testConnection = () => {

    if (socket && socket.connected) {
      console.log("🔌 Socket is connected with ID:", socket.id);
      return true;
    } else {
      console.log("⚠️ Socket is not connected");
      return false;
    }
  };