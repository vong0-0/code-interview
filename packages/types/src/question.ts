import type { Difficulty } from "./enums.js";

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  language: string | null;
  starterCode: string | null;
  solution: string | null;
  isPublic: boolean;
  authorId: string;
  createdAt: string;
}

export type QuestionSummary = Pick<
  Question,
  | "id"
  | "title"
  | "difficulty"
  | "language"
  | "isPublic"
  | "authorId"
  | "createdAt"
>;
