import type { Server, Socket } from "socket.io"
import logger from "../lib/logger.js"

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
}
