import type { Server, Socket } from "socket.io";
import logger from "../lib/logger";

export function registerRoomHandlers(io: Server, socket: Socket) {
  logger.info(`[Socket] connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`[Socket] disconnected: ${socket.id}`);
  });
}

export function initRoomHandlers(io: Server) {
  io.on("connection", (socket) => {
    registerRoomHandlers(io, socket);
  });
}
