import type { Server, Socket } from "socket.io"
import logger from "../lib/logger"
import { prisma as db } from "../lib/prisma.js"

export function registerRoomHandlers(io: Server, socket: Socket) {
  logger.info(`[Socket] connected: ${socket.id}`)

  socket.on(
    "room:join",
    async (payload: {
      roomCode: string
      name?: string
      role: "INTERVIEWER" | "CANDIDATE"
    }) => {
      try {
        const { roomCode, name, role } = payload

        const room = await db.room.findUnique({
          where: { code: roomCode },
          include: { participants: { where: { isActive: true } } },
        })

        if (!room) {
          socket.emit("room:error", { message: "Room not found" })
          return
        }

        if (room.status === "CLOSED") {
          socket.emit("room:error", { message: "Room is closed" })
          return
        }

        if (room.participants.length >= 2) {
          socket.emit("room:error", { message: "Room is full" })
          return
        }
        const userId = socket.data.user?.id ?? null
        const actualRole =
          userId && userId === room.interviewerId ? "INTERVIEWER" : "CANDIDATE"

        const participantName = socket.data.user?.name ?? name
        if (!participantName) {
          socket.emit("room:error", { message: "Name is required" })
          return
        }

        const participant = await db.roomParticipant.create({
          data: {
            roomId: room.id,
            userId,
            name: participantName,
            role: actualRole,
            isActive: true,
          },
        })

        await socket.join(roomCode)
        socket.data.roomCode = roomCode
        socket.data.participantId = participant.id
        socket.data.role = actualRole

        io.to(roomCode).emit("room:user-joined", {
          participantId: participant.id,
          name: participantName,
          role: actualRole,
        })

        socket.emit("room:joined", {
          roomId: room.id,
          roomCode,
          participantId: participant.id,
          name: participantName,
          role: actualRole,
        })

        console.log(`[Socket] ${participantName} joined room ${roomCode}`)
      } catch (err) {
        console.error("[Socket] room:join error", err)
        socket.emit("room:error", { message: "Failed to join room" })
      }
    }
  )

  socket.on(
    "room:leave",
    async (payload: { roomCode: string; participantId: string }) => {
      try {
        const { roomCode, participantId } = payload

        if (!roomCode || !participantId) {
          socket.emit("room:error", {
            message: "roomCode and participantId are required",
          })
          return
        }

        await db.roomParticipant.update({
          where: { id: participantId },
          data: { isActive: false, leftAt: new Date(), leaveReason: "LEFT" },
        })

        await socket.leave(roomCode)

        io.to(roomCode).emit("room:user-left", {
          participantId,
          role: socket.data.role,
        })

        logger.info(
          `[Socket] participantId: ${participantId} left room ${roomCode}`
        )
      } catch (err) {
        logger.error({ err }, "[Socket] room:leave error")
        socket.emit("room:error", { message: "Failed to leave room" })
      }
    }
  )

  socket.on("disconnect", async () => {
    logger.info(`[Socket] disconnected: ${socket.id}`)

    const { roomCode, participantId } = socket.data

    // ถ้าไม่มีข้อมูลแปลว่ายังไม่ได้ join room
    if (!roomCode || !participantId) return

    try {
      await db.roomParticipant.update({
        where: { id: participantId },
        data: {
          isActive: false,
          leftAt: new Date(),
          leaveReason: "LEFT",
        },
      })

      io.to(roomCode).emit("room:user-left", {
        participantId,
        role: socket.data.role,
      })

      logger.info(
        `[Socket] participantId: ${participantId} disconnected from room ${roomCode}`
      )
    } catch (err) {
      logger.error({ err }, "[Socket] disconnect cleanup error")
    }
  })
}

export function initRoomHandlers(io: Server) {
  io.on("connection", (socket) => {
    registerRoomHandlers(io, socket)
  })
}
