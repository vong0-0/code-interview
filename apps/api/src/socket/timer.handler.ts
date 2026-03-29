import type { Server, Socket } from "socket.io"
import { prisma as db } from "../lib/prisma.js"
import logger from "../lib/logger.js"

export function registerTimerHandlers(io: Server, socket: Socket) {
  socket.on(
    "timer:start",
    async (payload: { roomCode: string; duration: number }) => {
      try {
        const { roomCode, duration } = payload
        console.log(socket.data.roomCode)
        if (socket.data.roomCode !== roomCode) {
          socket.emit("room:error", { message: "You are not in this room" })
          return
        }

        if (!duration || duration <= 0) {
          socket.emit("room:error", {
            message: "Duration must be greater than 0",
          })
          return
        }

        const room = await db.room.findUnique({ where: { code: roomCode } })

        if (!room) {
          socket.emit("room:error", { message: "Room not found" })
          return
        }

        if (room.timerStatus !== "IDLE") {
          socket.emit("room:error", { message: "Timer is already running" })
          return
        }

        await db.room.update({
          where: { code: roomCode },
          data: {
            timerDuration: duration,
            timerStatus: "RUNNING",
            timerStartedAt: new Date(),
            timerRemaining: duration,
          },
        })

        io.to(roomCode).emit("timer:started", {
          duration,
          startedAt: new Date(),
        })

        logger.debug(
          `[Socket] timer:start in room ${roomCode} duration ${duration}s`
        )
      } catch (err) {
        logger.error({ err }, "[Socket] timer:start error")
        socket.emit("room:error", { message: "Failed to start timer" })
      }
    }
  )

  socket.on("timer:pause", async (payload: { roomCode: string }) => {
    try {
      const { roomCode } = payload

      if (socket.data.roomCode !== roomCode) {
        socket.emit("room:error", { message: "You are not in this room" })
        return
      }

      const room = await db.room.findUnique({ where: { code: roomCode } })

      if (!room) {
        socket.emit("room:error", { message: "Room not found" })
        return
      }

      if (room.timerStatus !== "RUNNING") {
        socket.emit("room:error", { message: "Timer is not running" })
        return
      }

      const elapsed = Math.floor(
        (Date.now() - room.timerStartedAt!.getTime()) / 1000
      )
      const remaining =
        (room.timerRemaining ?? room.timerDuration ?? 0) - elapsed

      await db.room.update({
        where: { code: roomCode },
        data: {
          timerStatus: "PAUSED",
          timerRemaining: remaining,
        },
      })

      io.to(roomCode).emit("timer:paused", { remaining })

      logger.debug(
        `[Socket] timer:pause in room ${roomCode} remaining ${remaining}s`
      )
    } catch (err) {
      logger.error({ err }, "[Socket] timer:pause error")
      socket.emit("room:error", { message: "Failed to pause timer" })
    }
  })

  socket.on("timer:resume", async (payload: { roomCode: string }) => {
    try {
      const { roomCode } = payload

      if (socket.data.roomCode !== roomCode) {
        socket.emit("room:error", { message: "You are not in this room" })
        return
      }

      const room = await db.room.findUnique({ where: { code: roomCode } })

      if (!room) {
        socket.emit("room:error", { message: "Room not found" })
        return
      }

      if (room.timerStatus !== "PAUSED") {
        socket.emit("room:error", { message: "Timer is not paused" })
        return
      }

      await db.room.update({
        where: { code: roomCode },
        data: {
          timerStatus: "RUNNING",
          timerStartedAt: new Date(),
        },
      })

      io.to(roomCode).emit("timer:resumed", {
        remaining: room.timerRemaining,
        startedAt: new Date(),
      })

      logger.debug(`[Socket] timer:resume in room ${roomCode}`)
    } catch (err) {
      logger.error({ err }, "[Socket] timer:resume error")
      socket.emit("room:error", { message: "Failed to resume timer" })
    }
  })

  socket.on("timer:stop", async (payload: { roomCode: string }) => {
    try {
      const { roomCode } = payload

      if (socket.data.roomCode !== roomCode) {
        socket.emit("room:error", { message: "You are not in this room" })
        return
      }

      const room = await db.room.findUnique({ where: { code: roomCode } })

      if (!room) {
        socket.emit("room:error", { message: "Room not found" })
        return
      }

      await db.room.update({
        where: { code: roomCode },
        data: {
          timerStatus: "IDLE",
          timerStartedAt: null,
          timerRemaining: room.timerDuration ?? 0,
        },
      })

      io.to(roomCode).emit("timer:stopped")

      logger.debug(`[Socket] timer:stop in room ${roomCode}`)
    } catch (err) {
      logger.error({ err }, "[Socket] timer:stop error")
      socket.emit("room:error", { message: "Failed to stop timer" })
    }
  })

  socket.on("timer:finished", async (payload: { roomCode: string }) => {
    try {
      const { roomCode } = payload

      if (socket.data.roomCode !== roomCode) {
        socket.emit("room:error", { message: "You are not in this room" })
        return
      }

      const room = await db.room.findUnique({ where: { code: roomCode } })

      if (!room) {
        socket.emit("room:error", { message: "Room not found" })
        return
      }

      if (room.timerStatus !== "RUNNING") {
        return
      }

      await db.room.update({
        where: { code: roomCode },
        data: {
          timerStatus: "FINISHED",
          timerRemaining: 0,
        },
      })

      io.to(roomCode).emit("timer:finished")

      logger.debug(`[Socket] timer:finished in room ${roomCode}`)
    } catch (err) {
      logger.error({ err }, "[Socket] timer:finished error")
      socket.emit("room:error", { message: "Failed to finish timer" })
    }
  })
}
