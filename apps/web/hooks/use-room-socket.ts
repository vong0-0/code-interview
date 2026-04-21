"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { socket } from "@/lib/socket";
import type {
  ServerRoomJoinedPayload,
  ServerRoomUserJoinedPayload,
  ServerRoomUserLeftPayload,
  ServerRoomErrorPayload,
  ClientRoomJoinPayload,
} from "@code-interview/types";

export interface Participant {
  id: string;
  name: string;
  role: string;
}

// Global map to track join attempts across re-mounts (e.g. React StrictMode)
const joinCooldown = new Map<string, number>();
const COOLDOWN_DURATION = 1000; // 1 second

export function useRoomSocket(roomCode: string, name?: string) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [roomData, setRoomData] = useState<ServerRoomJoinedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);

  // Guard to prevent multiple join attempts within the same session/mount
  const isJoinedRef = useRef(false);

  const joinRoom = useCallback(() => {
    if (!roomCode || isJoinedRef.current) return;

    const lastJoin = joinCooldown.get(roomCode);
    if (lastJoin && Date.now() - lastJoin < COOLDOWN_DURATION) {
      console.log(`[Socket] Join throttled for room ${roomCode}`);
      return;
    }

    setIsJoining(true);
    setError(null);
    isJoinedRef.current = true;
    joinCooldown.set(roomCode, Date.now());

    if (!socket.connected) {
      socket.connect();
    }

    const payload: ClientRoomJoinPayload = { roomCode, name };
    socket.emit("room:join", payload);
  }, [roomCode, name]);

  useEffect(() => {
    joinRoom();

    const onJoined = (payload: ServerRoomJoinedPayload) => {
      setRoomData(payload);
      setIsJoining(false);
      
      // Initialize with all current participants in the room
      setParticipants(
        payload.participants.map((p) => ({
          id: p.participantId,
          name: p.name,
          role: p.role,
        }))
      );
    };

    const onUserJoined = (payload: ServerRoomUserJoinedPayload) => {
      setParticipants((prev) => {
        // Prevent duplicates
        if (prev.find((p) => p.id === payload.participantId)) return prev;
        return [...prev, { id: payload.participantId, name: payload.name, role: payload.role }];
      });
    };

    const onUserLeft = (payload: ServerRoomUserLeftPayload) => {
      setParticipants((prev) => prev.filter((p) => p.id !== payload.participantId));
    };

    const onRoomError = (payload: ServerRoomErrorPayload) => {
      setError(payload.message);
      setIsJoining(false);
    };

    socket.on("room:joined", onJoined);
    socket.on("room:user-joined", onUserJoined);
    socket.on("room:user-left", onUserLeft);
    socket.on("room:error", onRoomError);

    return () => {
      socket.off("room:joined", onJoined);
      socket.off("room:user-joined", onUserJoined);
      socket.off("room:user-left", onUserLeft);
      socket.off("room:error", onRoomError);
      
      isJoinedRef.current = false; // Reset guard on unmount
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [joinRoom]);

  return {
    participants,
    roomData,
    error,
    isJoining,
    socket,
    initialMessages: roomData?.messages ?? [],
    initialQuestion: roomData?.question ?? null,
    timerStatus: roomData?.timerStatus ?? "IDLE",
    initialTimerRemaining: roomData?.timerRemaining ?? null,
    retry: () => {
      isJoinedRef.current = false;
      joinRoom();
    },
  };
}
