import { api } from "@/lib/api";
import type { Question, QuestionSummary } from "@code-interview/types";
import { QuestionFormPayload } from "../schemas/question.schema";
import { QuestionFilters } from "../types/question.type";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const questionKeys = {
  all: ["questions"] as const,
  lists: () => [...questionKeys.all, "list"] as const,
  list: (filters: QuestionFilters) =>
    [...questionKeys.lists(), filters] as const,
  detail: (id: string) => [...questionKeys.all, "detail", id] as const,
};

// ─── Service ──────────────────────────────────────────────────────────────────

export const questionService = {
  getAll: async (filters?: QuestionFilters): Promise<QuestionSummary[]> => {
    const { data } = await api.get("/questions", { params: filters });
    return data.questions;
  },

  create: async (payload: QuestionFormPayload): Promise<Question> => {
    const { data } = await api.post("/questions", payload);
    return data.question;
  },

  getOne: async (id: string): Promise<Question> => {
    const { data } = await api.get(`/questions/${id}`);
    return data.question;
  },

  update: async (id: string, payload: QuestionFormPayload): Promise<Question> => {
    const { data } = await api.put(`/questions/${id}`, payload);
    return data.question;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/questions/${id}`);
  },
};
