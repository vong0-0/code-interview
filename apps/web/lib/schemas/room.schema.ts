import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────

export const roomFormSchema = z.object({
  title: z.string().min(1, "Room title is required").max(100),
  language: z.string().min(1, "Language is required"),
  question: z.string().optional(),
  roomDuration: z.number().min(0, "Duration must be positive"),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type RoomFormValues = z.infer<typeof roomFormSchema>;

export interface RoomFormPayload {
  title: string;
  language: string;
  questionId?: string;
  roomDuration: number;
}

export interface CloseRoomPayload {
  status: "CLOSED";
}
