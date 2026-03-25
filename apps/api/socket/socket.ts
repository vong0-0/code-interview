import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { corsOptions } from "../src/config/cors.js";

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: corsOptions,
  });
  return io;
}

export function getIO(): Server {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
