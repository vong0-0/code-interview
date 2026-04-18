import { Difficulty } from "@code-interview/types";
import { z } from "zod";
import { QUESTION_DIFFICULTIES } from "@/app/constants/questions";

// ─── Schema ───────────────────────────────────────────────────────────────────

export const questionFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(QUESTION_DIFFICULTIES, {
    message: "Please select a difficulty level",
  }),
  language: z.string().min(1, "Language is required"),
  starterCode: z.string().optional(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

export interface QuestionFormPayload {
  title: string;
  description: string;
  difficulty: Difficulty;
  language: string;
  starterCode?: string;
}
