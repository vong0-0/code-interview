import type { Server, Socket } from "socket.io"
import logger from "../lib/logger"
import { prisma as db } from "../lib/prisma.js"
import { registerCodeHandlers } from "./code.handler"
import { registerChatHandlers } from "./chat.handler"
import { registerTimerHandlers } from "./timer.handler"
import { registerSnapshotHandlers } from "./snapshot.handler"
import { registerQuestionHandlers } from "./question.handler"

export function registerRoomHandlers(io: Server, socket: Socket) {
  logger.info(`[Socket] connected: ${socket.id}`)

  socket.on(
    "room:join",
    async (payload: { roomCode: string; name?: string }) => {
      try {
        const { roomCode, name } = payload

        const room = await db.room.findUnique({
          where: { code: roomCode },
          include: {
            participants: { where: { isActive: true } },
            question: true,
          },
        })

        if (!room) {
          socket.emit("room:error", { message: "Room not found" })
          return
        }

        if (
          room.status === "CLOSED" &&
          room.interviewerId !== socket.data.user?.id
        ) {
          socket.emit("room:error", { message: "Room is closed" })
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

        // 1. & 2. Find existing or Atomic Create in a transaction
        const participant = await db.$transaction(async (tx) => {
          // Check if user is already an active participant
          const existing = await tx.roomParticipant.findFirst({
            where: {
              roomId: room.id,
              isActive: true,
              OR: userId ? [{ userId }] : [{ name: participantName }],
            },
          });

          if (existing) return existing;

          // Check if room is full (re-query for accuracy inside transaction)
          const currentCount = await tx.roomParticipant.count({
            where: { roomId: room.id, isActive: true },
          });

          if (currentCount >= 2) {
            return null;
          }

          // Create new record
          return await tx.roomParticipant.create({
            data: {
              roomId: room.id,
              userId,
              name: participantName,
              role: actualRole,
              isActive: true,
            },
          });
        });

        if (!participant) {
          socket.emit("room:error", { message: "Room is full" })
          return
        }

        const snapshot = await db.codeSnapshot.findFirst({
          where: { roomId: room.id, language: room.language },
          orderBy: { savedAt: "desc" },
        })

        await socket.join(roomCode)
        socket.data.roomCode = roomCode
        socket.data.participantId = participant.id
        socket.data.role = actualRole
        socket.data.name = participantName

        socket.to(roomCode).emit("room:user-joined", {
          participantId: participant.id,
          name: participantName,
          role: actualRole,
        })

        const currentParticipants = room.participants.map((p) => ({
          participantId: p.id,
          name: p.name,
          role: p.role as any,
        }))

        // Add the newcomer to the list ONLY if they weren't already in the initial fetch
        if (!room.participants.some((p) => p.id === participant.id)) {
          currentParticipants.push({
            participantId: participant.id,
            name: participantName,
            role: actualRole,
          })
        }

        const messages = await db.message.findMany({
          where: { roomId: room.id },
          orderBy: { createdAt: "asc" },
        })

        // Calculate actual remaining time if running
        let actualRemaining = room.timerRemaining
        if (room.timerStatus === "RUNNING" && room.timerStartedAt) {
          const elapsed = Math.floor(
            (Date.now() - room.timerStartedAt.getTime()) / 1000
          )
          actualRemaining = Math.max(0, (room.timerRemaining ?? 0) - elapsed)
        }

        socket.emit("room:joined", {
          roomId: room.id,
          roomCode,
          participantId: participant.id,
          name: participantName,
          role: actualRole,
          language: room.language,
          lastCode: snapshot?.code ?? room.question?.starterCode ?? null,
          participants: currentParticipants,
          messages: messages.map((m) => ({
            id: m.id,
            senderName: m.senderName,
            content: m.content,
            createdAt: m.createdAt.toISOString(),
          })),
          question: room.question
            ? {
                id: room.question.id,
                title: room.question.title,
                description: room.question.description,
                difficulty: room.question.difficulty as any,
              }
            : null,
          timerStatus: room.timerStatus as any,
          timerRemaining: actualRemaining,
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

        if (socket.data.roomCode !== roomCode) {
          socket.emit("room:error", { message: "You are not in this room" })
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
    registerCodeHandlers(io, socket)
    registerChatHandlers(io, socket)
    registerTimerHandlers(io, socket)
    registerSnapshotHandlers(io, socket)
    registerQuestionHandlers(io, socket)
  })
}
