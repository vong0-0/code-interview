import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

/**
 * Centralized socket instance for the application.
 * 
 * - autoConnect: false - We manually connect when entering a room.
 * - withCredentials: true - Necessary for sending cookies (session) to the backend.
 */
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

// For debugging in development
if (process.env.NODE_ENV === "development") {
  socket.on("connect", () => {
    console.log("[Socket] Connected to server:", SOCKET_URL);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Connection Error:", error.message);
  });
}
