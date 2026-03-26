import { prisma as db } from "../lib/prisma";

export async function generateUniqueRoomCode(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  while (true) {
    const code = Array.from(
      { length: 6 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");

    const existing = await db.room.findUnique({ where: { code } });
    if (!existing) return code;
  }
}
