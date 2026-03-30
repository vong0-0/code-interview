import type { RoomStatus } from "./enums.js";
import type { QuestionSummary } from "./question.js";

export interface Room {
  id: string;
  code: string;
  title: string;
  interviewerId: string;
  language: string;
  status: RoomStatus;
  roomDuration: number;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  questionId: string | null;
  question: QuestionSummary | null;
}

export type RoomSummary = Pick<
  Room,
  | "code"
  | "title"
  | "status"
  | "language"
  | "roomDuration"
  | "createdAt"
  | "question"
> & {
  participantCount: number;
};

export type RoomDetail = Pick<
  Room,
  "code" | "title" | "status" | "language" | "roomDuration"
> & {
  question: QuestionSummary | null;
};
