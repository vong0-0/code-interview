import type { Difficulty } from "./enums.js";

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  language: string | null;
  starterCode: string | null;
  authorId: string;
  createdAt: string;
}

export type QuestionSummary = Pick<
  Question,
  | "id"
  | "title"
  | "description"
  | "difficulty"
  | "language"
  | "authorId"
  | "createdAt"
>;
