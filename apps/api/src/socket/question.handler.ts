import type { Server, Socket } from "socket.io"
import { prisma as db } from "../lib/prisma.js"
import logger from "../lib/logger.js"

export function registerQuestionHandlers(io: Server, socket: Socket) {
  socket.on(
    "question:change",
    async (payload: { roomCode: string; questionId: string }) => {
      try {
        const { roomCode, questionId } = payload

        if (socket.data.roomCode !== roomCode) {
          socket.emit("room:error", { message: "You are not in this room" })
          return
        }

        const room = await db.room.findUnique({
          where: { code: roomCode },
        })

        if (!room) {
          socket.emit("room:error", { message: "Room not found" })
          return
        }

        // Verify authorization: Only the room interviewer can change questions
        if (room.interviewerId !== socket.data.user?.id) {
          socket.emit("room:error", {
            message: "Only the interviewer can change the question",
          })
          return
        }

        const question = await db.question.findUnique({
          where: { id: questionId },
        })

        if (!question) {
          socket.emit("room:error", { message: "Question not found" })
          return
        }

        await db.room.update({
          where: { code: roomCode },
          data: { questionId },
        })

        io.to(roomCode).emit("question:changed", {
          id: question.id,
          title: question.title,
          description: question.description,
          difficulty: question.difficulty,
        })

        logger.info(
          `[Socket] question changed to ${question.title} in room ${roomCode}`
        )
      } catch (err) {
        logger.error({ err }, "[Socket] question:change error")
        socket.emit("room:error", { message: "Failed to change question" })
      }
    }
  )
}
