"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { socket } from "@/lib/socket";

export function useTimerSync(
  roomCode: string,
  initialStatus: "IDLE" | "RUNNING" | "PAUSED" | "FINISHED" = "IDLE",
  initialRemaining: number | null = null
) {
  const [status, setStatus] = useState(initialStatus);
  const [remaining, setRemaining] = useState(initialRemaining || 0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startLocalTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStatus("FINISHED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopLocalTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleStarted = (payload: { duration: number; startedAt: string }) => {
      setRemaining(payload.duration);
      setStatus("RUNNING");
      startLocalTimer();
    };

    const handlePaused = (payload: { remaining: number }) => {
      setRemaining(payload.remaining);
      setStatus("PAUSED");
      stopLocalTimer();
    };

    const handleResumed = (payload: { remaining: number; startedAt: string }) => {
      setRemaining(payload.remaining);
      setStatus("RUNNING");
      startLocalTimer();
    };

    const handleStopped = () => {
      setStatus("IDLE");
      setRemaining(0);
      stopLocalTimer();
    };

    const handleFinished = () => {
      setStatus("FINISHED");
      setRemaining(0);
      stopLocalTimer();
    };

    socket.on("timer:started", handleStarted);
    socket.on("timer:paused", handlePaused);
    socket.on("timer:resumed", handleResumed);
    socket.on("timer:stopped", handleStopped);
    socket.on("timer:finished", handleFinished);

    return () => {
      socket.off("timer:started", handleStarted);
      socket.off("timer:paused", handlePaused);
      socket.off("timer:resumed", handleResumed);
      socket.off("timer:stopped", handleStopped);
      socket.off("timer:finished", handleFinished);
      stopLocalTimer();
    };
  }, [startLocalTimer, stopLocalTimer]);

  // Handle initialization/resync
  useEffect(() => {
    if (status === "RUNNING") {
      startLocalTimer();
    } else {
      stopLocalTimer();
    }
  }, [status, startLocalTimer, stopLocalTimer]);

  const startTimer = (duration: number) => {
    socket.emit("timer:start", { roomCode, duration });
  };

  const pauseTimer = () => {
    socket.emit("timer:pause", { roomCode });
  };

  const resumeTimer = () => {
    socket.emit("timer:resume", { roomCode });
  };

  const stopTimer = () => {
    socket.emit("timer:stop", { roomCode });
  };

  return {
    status,
    remaining,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  };
}
