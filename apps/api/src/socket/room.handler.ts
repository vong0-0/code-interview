import type { Server, Socket } from "socket.io";
import logger from "../lib/logger";
import { prisma as db } from "../lib/prisma.js";

export function registerRoomHandlers(io: Server, socket: Socket) {
  logger.info(`[Socket] connected: ${socket.id}`);

  socket.on(
    "room:join",
    async (payload: {
      roomCode: string;
      name?: string;
      role: "INTERVIEWER" | "CANDIDATE";
    }) => {
      try {
        const { roomCode, name, role } = payload;

        // 1. หา room จาก DB
        const room = await db.room.findUnique({
          where: { code: roomCode },
          include: { participants: { where: { isActive: true } } },
        });

        if (!room) {
          socket.emit("room:error", { message: "Room not found" });
          return;
        }

        if (room.status === "CLOSED") {
          socket.emit("room:error", { message: "Room is closed" });
          return;
        }

        // 2. เช็คว่าเต็มหรือยัง (max 2 คน)
        if (room.participants.length >= 2) {
          socket.emit("room:error", { message: "Room is full" });
          return;
        }

        // 3. เอา userId และ name
        const userId = socket.data.user?.id ?? null;
        const participantName = socket.data.user?.name ?? name;

        if (!participantName) {
          socket.emit("room:error", { message: "Name is required" });
          return;
        }

        // 4. บันทึก RoomParticipant ลง DB
        const participant = await db.roomParticipant.create({
          data: {
            roomId: room.id,
            userId,
            name: participantName,
            role,
            isActive: true,
          },
        });

        // 5. Join socket room
        await socket.join(roomCode);

        // 6. แจ้งคนในห้องว่ามีคนเข้ามา
        io.to(roomCode).emit("room:user-joined", {
          participantId: participant.id,
          name: participantName,
          role,
        });

        // 7. ส่ง room data กลับให้คนที่เพิ่ง join
        socket.emit("room:joined", {
          roomId: room.id,
          roomCode,
          participantId: participant.id,
          name: participantName,
          role,
        });

        console.log(`[Socket] ${participantName} joined room ${roomCode}`);
      } catch (err) {
        console.error("[Socket] room:join error", err);
        socket.emit("room:error", { message: "Failed to join room" });
      }
    },
  );

  socket.on("disconnect", () => {
    logger.info(`[Socket] disconnected: ${socket.id}`);
  });
}

export function initRoomHandlers(io: Server) {
  io.on("connection", (socket) => {
    registerRoomHandlers(io, socket);
  });
}
