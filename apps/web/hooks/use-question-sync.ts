"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import type { ServerQuestionPayload } from "@code-interview/types";

export function useQuestionSync(initialQuestion: ServerQuestionPayload | null = null) {
  const [question, setQuestion] = useState<ServerQuestionPayload | null>(initialQuestion);

  useEffect(() => {
    const onQuestionChanged = (payload: ServerQuestionPayload) => {
      console.log("[Socket] Received question:changed", payload.title);
      setQuestion(payload);
    };

    socket.on("question:changed", onQuestionChanged);

    return () => {
      socket.off("question:changed", onQuestionChanged);
    };
  }, []);

  // Update when initial question changes (on join room)
  useEffect(() => {
    if (initialQuestion && !question) {
      setQuestion(initialQuestion);
    }
  }, [initialQuestion, question]);

  return {
    question,
    setQuestion,
  };
}
