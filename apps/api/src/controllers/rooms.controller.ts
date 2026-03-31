import type { Request, Response } from "express"
import { prisma as db } from "../lib/prisma.js"
import { generateUniqueRoomCode } from "../utils/room-code.js"
import { validateRequiredFields } from "../utils/validate-fields.js"

export async function getRooms(req: Request, res: Response) {
  try {
    const userId = req.user.id

    const rooms = await db.room.findMany({
      where: { interviewerId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        code: true,
        title: true,
        status: true,
        language: true,
        roomDuration: true,
        createdAt: true,
        question: {
          select: { id: true, title: true, difficulty: true },
        },
        _count: {
          select: { participants: { where: { isActive: false } } },
        },
      },
    })

    res.json({ rooms })
  } catch (err) {
    console.error("[getRooms]", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function getRoom(req: Request, res: Response) {
  try {
    const { code } = req.params

    const room = await db.room.findUnique({
      where: { code },
      select: {
        code: true,
        title: true,
        status: true,
        language: true,
        roomDuration: true,
        question: {
          select: { id: true, title: true, difficulty: true },
        },
      },
    })

    if (!room) {
      res.status(404).json({ error: "Room not found" })
      return
    }

    res.json({ room })
  } catch (err) {
    console.error("[getRoom]", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function createRoom(req: Request, res: Response) {
  try {
    const userId = req.user.id
    const { title, language = "javascript", roomDuration = 1800 } = req.body

    const error = validateRequiredFields(req.body, ["title"])

    if (error) {
      res.status(400).json({ error })
      return
    }

    const code = await generateUniqueRoomCode()

    const room = await db.room.create({
      data: {
        code,
        title,
        language,
        roomDuration,
        interviewerId: userId,
        status: "OPEN",
      },
    })

    res.status(201).json({ room })
  } catch (err) {
    console.error("[createRoom]", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function updateRoom(req: Request, res: Response) {
  try {
    const userId = req.user.id
    const { code } = req.params
    const { title, language, questionId, roomDuration, status } = req.body

    const room = await db.room.findUnique({ where: { code } })

    if (!room) {
      res.status(404).json({ error: "Room not found" })
      return
    }

    if (room.interviewerId !== userId) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    if (room.status === "CLOSED") {
      res.status(400).json({ error: "Room is closed" })
      return
    }

    // validate status ถ้าส่งมา
    if (status !== undefined && status !== "CLOSED") {
      res.status(400).json({ error: "status can only be set to CLOSED" })
      return
    }

    const updated = await db.room.update({
      where: { code },
      data: {
        ...(title && { title }),
        ...(language && { language }),
        ...(questionId !== undefined && { questionId }),
        ...(roomDuration && { roomDuration }),
        ...(status === "CLOSED" && { status, closedAt: new Date() }),
      },
    })

    if (status === "CLOSED") {
      await db.roomParticipant.updateMany({
        where: { roomId: room.id, isActive: true },
        data: { isActive: false, leftAt: new Date(), leaveReason: "CLOSED" },
      })

      const { getIO } = await import("../socket/socket.js")
      getIO()
        .to(code)
        .emit("room:closed", { reason: "Room closed by interviewer" })
    }

    res.json({ room: updated })
  } catch (err) {
    console.error("[updateRoom]", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function deleteRoom(req: Request, res: Response) {
  try {
    const userId = req.user.id
    const { code } = req.params

    const room = await db.room.findUnique({ where: { code } })

    if (!room) {
      res.status(404).json({ error: "Room not found" })
      return
    }

    if (room.interviewerId !== userId) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    await db.room.delete({ where: { code } })

    res.json({ message: "Room deleted" })
  } catch (err) {
    console.error("[deleteRoom]", err)
    res.status(500).json({ error: "Internal server error" })
  }
}
