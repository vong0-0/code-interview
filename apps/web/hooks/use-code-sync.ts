import { useEffect, useState, useCallback, useRef } from "react";
import { socket } from "@/lib/socket";
import type { ServerCodeChangedPayload, ClientCodeChangePayload } from "@code-interview/types";
import { DEBOUNCE_DELAY } from "@/app/constants/debounce";

export function useCodeSync(roomCode: string, initialCode?: string | null) {
  const [code, setCode] = useState(initialCode || "");

  // Track if the update is coming from a remote source to avoid emitting it back
  const isRemoteUpdate = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  // Manual debounce implementation to avoid extra dependencies
  const debouncedEmit = useCallback(
    (content: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (!roomCode) return;
        
        const payload: ClientCodeChangePayload = { roomCode, content };
        socket.emit("code:change", payload);
        console.log("[Socket] Emitting code:change", { roomCode });
      }, DEBOUNCE_DELAY.editor);
    },
    [roomCode]
  );

  const handleCodeChange = useCallback(
    (newCode: string | undefined) => {
      const val = newCode ?? "";
      setCode(val);

      // If this wasn't a remote update, emit it
      if (!isRemoteUpdate.current) {
        debouncedEmit(val);
      }
      
      // Reset the remote update flag
      isRemoteUpdate.current = false;
    },
    [debouncedEmit]
  );

  useEffect(() => {
    // Listen for remote code changes
    const onCodeChanged = (payload: ServerCodeChangedPayload) => {
      console.log("[Socket] Received code:changed from", payload.by);
      
      // Mark this as a remote update before updating state
      isRemoteUpdate.current = true;
      setCode(payload.content);
    };

    socket.on("code:changed", onCodeChanged);

    return () => {
      socket.off("code:changed", onCodeChanged);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [debouncedEmit]);

  return {
    code,
    handleCodeChange,
    setCode,
  };
}
