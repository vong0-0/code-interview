import type { Request, Response } from "express";
import { prisma as db } from "../lib/prisma.js";
import { generateUniqueRoomCode } from "../utils/room-code.js";
import { validateRequiredFields } from "../utils/validate-fields.js";

export async function createRoom(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const { title, language = "javascript", roomDuration = 1800 } = req.body;

    const error = validateRequiredFields(req.body, ["title"]);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    const code = await generateUniqueRoomCode();

    const room = await db.room.create({
      data: {
        code,
        title,
        language,
        roomDuration,
        interviewerId: userId,
        status: "WAITING",
      },
    });

    res.status(201).json({ room });
  } catch (err) {
    console.error("[createRoom]", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
