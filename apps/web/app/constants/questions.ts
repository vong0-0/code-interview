import { Difficulty } from "@code-interview/types";

export const QUESTION_DIFFICULTIES: [Difficulty, ...Difficulty[]] = [
  "EASY",
  "MEDIUM",
  "HARD",
];

export const PROGRAMMING_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
] as const;

export type ProgrammingLanguage = (typeof PROGRAMMING_LANGUAGES)[number]["value"];
