import type { Server, Socket } from "socket.io"
import logger from "../lib/logger.js"
import { prisma as db } from "../lib/prisma.js"

export function registerCodeHandlers(io: Server, socket: Socket) {
  socket.on("code:change", (payload: { roomCode: string; content: string }) => {
    const { roomCode, content } = payload

    if (socket.data.roomCode !== roomCode) {
      socket.emit("room:error", { message: "You are not in this room" })
      return
    }

    socket.to(roomCode).emit("code:changed", {
      content,
      by: socket.data.participantId,
    })

    logger.debug(
      `[Socket] code:change in room ${roomCode} by ${socket.data.participantId}`
    )
  })

  socket.on(
    "language:change",
    async (payload: { roomCode: string; language: string; code: string }) => {
      try {
        const { roomCode, language, code } = payload

        if (socket.data.roomCode !== roomCode) {
          socket.emit("room:error", { message: "You are not in this room" })
          return
        }

        // Update the room's language in DB
        await db.room.update({
          where: { code: roomCode },
          data: { language },
        })

        // Broadcast to all
        io.to(roomCode).emit("language:changed", {
          language,
          lastCode: code,
        })

        logger.info(`[Socket] language changed to ${language} in room ${roomCode}`)
      } catch (err) {
        logger.error({ err }, "[Socket] language:change error")
        socket.emit("room:error", { message: "Failed to change language" })
      }
    }
  )
}
