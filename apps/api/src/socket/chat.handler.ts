import type { Server, Socket } from "socket.io"
import { prisma as db } from "../lib/prisma.js"
import logger from "../lib/logger.js"

export function registerChatHandlers(io: Server, socket: Socket) {
  socket.on(
    "chat:message",
    async (payload: { roomCode: string; content: string }) => {
      try {
        const { roomCode, content } = payload

        if (socket.data.roomCode !== roomCode) {
          socket.emit("room:error", { message: "You are not in this room" })
          return
        }

        if (!content?.trim()) {
          socket.emit("room:error", { message: "Content is required" })
          return
        }

        const room = await db.room.findUnique({ where: { code: roomCode } })

        if (!room) {
          socket.emit("room:error", { message: "Room not found" })
          return
        }

        const message = await db.message.create({
          data: {
            roomId: room.id,
            senderName: socket.data.name,
            userId: socket.data.user?.id ?? null,
            content: content.trim(),
          },
        })

        io.to(roomCode).emit("chat:message:received", {
          id: message.id,
          senderName: message.senderName,
          content: message.content,
          createdAt: message.createdAt,
        })

        logger.debug(
          `[Socket] chat:message in room ${roomCode} by ${message.senderName}`
        )
      } catch (err) {
        logger.error({ err }, "[Socket] chat:message error")
        socket.emit("room:error", { message: "Failed to send message" })
      }
    }
  )
}
