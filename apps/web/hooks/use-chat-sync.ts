"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { socket } from "@/lib/socket";
import type { ServerChatMessagePayload } from "@code-interview/types";

export function useChatSync(roomCode: string, initialMessages: ServerChatMessagePayload[] = []) {
  const [messages, setMessages] = useState<ServerChatMessagePayload[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(
    (content: string) => {
      if (!roomCode || !content.trim()) return;

      socket.emit("chat:message", {
        roomCode,
        content: content.trim(),
      });
      console.log("[Socket] Emitting chat:message", { roomCode });
    },
    [roomCode]
  );

  useEffect(() => {
    const onMessageReceived = (payload: ServerChatMessagePayload) => {
      console.log("[Socket] Received chat:message:received", payload);
      setMessages((prev) => {
        // Prevent duplicates (though id should be unique)
        if (prev.find((m) => m.id === payload.id)) return prev;
        return [...prev, payload];
      });
    };

    socket.on("chat:message:received", onMessageReceived);

    return () => {
      socket.off("chat:message:received", onMessageReceived);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return {
    messages,
    sendMessage,
    messagesEndRef,
    scrollToBottom,
  };
}
