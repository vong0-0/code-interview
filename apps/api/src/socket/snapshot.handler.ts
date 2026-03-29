import type { Server, Socket } from "socket.io"
import { prisma as db } from "../lib/prisma.js"
import logger from "../lib/logger.js"

export function registerSnapshotHandlers(io: Server, socket: Socket) {
  socket.on(
    "code:snapshot",
    async (payload: { roomCode: string; code: string; language: string }) => {
      try {
        const { roomCode, code, language } = payload

        if (socket.data.roomCode !== roomCode) {
          socket.emit("room:error", { message: "You are not in this room" })
          return
        }

        const room = await db.room.findUnique({ where: { code: roomCode } })

        if (!room) {
          socket.emit("room:error", { message: "Room not found" })
          return
        }

        await db.codeSnapshot.create({
          data: {
            roomId: room.id,
            code,
            language,
          },
        })

        logger.debug(`[Socket] code:snapshot saved in room ${roomCode}`)
      } catch (err) {
        logger.error({ err }, "[Socket] code:snapshot error")
        socket.emit("room:error", { message: "Failed to save snapshot" })
      }
    }
  )

  socket.on(
    "language:change",
    async (payload: { roomCode: string; language: string; code: string }) => {
      try {
        const { roomCode, language, code } = payload

        if (socket.data.roomCode !== roomCode) {
          socket.emit("room:error", { message: "You are not in this room" })
          return
        }

        const room = await db.room.findUnique({
          where: { code: roomCode },
          include: { question: true },
        })

        if (!room) {
          socket.emit("room:error", { message: "Room not found" })
          return
        }

        // Save snapshot ของ language เก่าก่อน
        await db.codeSnapshot.create({
          data: {
            roomId: room.id,
            code,
            language: room.language,
          },
        })

        // Update language ใหม่
        await db.room.update({
          where: { code: roomCode },
          data: { language },
        })

        // ดึง snapshot ล่าสุดของ language ใหม่ (ถ้ามี)
        const snapshot = await db.codeSnapshot.findFirst({
          where: { roomId: room.id, language },
          orderBy: { savedAt: "desc" },
        })

        io.to(roomCode).emit("language:changed", {
          language,
          lastCode: snapshot?.code ?? room.question?.starterCode ?? null,
        })

        logger.debug(
          `[Socket] language:change in room ${roomCode} to ${language}`
        )
      } catch (err) {
        logger.error({ err }, "[Socket] language:change error")
        socket.emit("room:error", { message: "Failed to change language" })
      }
    }
  )
}
