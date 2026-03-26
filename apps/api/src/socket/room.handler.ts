import type { Server, Socket } from "socket.io";

export function registerRoomHandlers(io: Server, socket: Socket) {
  console.log(`[Socket] connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`[Socket] disconnected: ${socket.id}`);
  });
}

export function initRoomHandlers(io: Server) {
  io.on("connection", (socket) => {
    registerRoomHandlers(io, socket);
  });
}
