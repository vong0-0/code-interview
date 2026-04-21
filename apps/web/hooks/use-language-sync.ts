"use client";

import { useEffect, useState, useCallback } from "react";
import { socket } from "@/lib/socket";
import type { ServerLanguageChangedPayload } from "@code-interview/types";

export function useLanguageSync(roomCode: string, initialLanguage?: string | null, onRemoteLanguageChange?: (code: string | null) => void) {
  const [language, setLanguage] = useState(initialLanguage || "javascript");

  const changeLanguage = useCallback(
    (newLanguage: string, currentCode: string) => {
      setLanguage(newLanguage);
      if (!roomCode) return;

      socket.emit("language:change", {
        roomCode,
        language: newLanguage,
        code: currentCode,
      });
      console.log("[Socket] Emitting language:change", { newLanguage });
    },
    [roomCode]
  );

  useEffect(() => {
    const onLanguageChanged = (payload: ServerLanguageChangedPayload) => {
      console.log("[Socket] Received language:changed", payload.language);
      setLanguage(payload.language);
      if (onRemoteLanguageChange) {
        onRemoteLanguageChange(payload.lastCode);
      }
    };

    socket.on("language:changed", onLanguageChanged);

    return () => {
      socket.off("language:changed", onLanguageChanged);
    };
  }, [onRemoteLanguageChange]);

  return {
    language,
    changeLanguage,
    setLanguage,
  };
}
