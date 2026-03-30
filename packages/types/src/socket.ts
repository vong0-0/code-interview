import type { ParticipantRole } from "./enums.js";

// Client → Server
export interface ClientRoomJoinPayload {
  roomCode: string;
  name?: string;
}

export interface ClientRoomLeavePayload {
  roomCode: string;
  participantId: string;
}

export interface ClientCodeChangePayload {
  roomCode: string;
  content: string;
}

export interface ClientChatMessagePayload {
  roomCode: string;
  content: string;
}

export interface ClientTimerStartPayload {
  roomCode: string;
  duration: number;
}

export interface ClientTimerPayload {
  roomCode: string;
}

export interface ClientCodeSnapshotPayload {
  roomCode: string;
  code: string;
  language: string;
}

export interface ClientLanguageChangePayload {
  roomCode: string;
  language: string;
  code: string;
}

// Server → Client
export interface ServerRoomJoinedPayload {
  roomCode: string;
  participantId: string;
  name: string;
  role: ParticipantRole;
  language: string;
  lastCode: string | null;
}

export interface ServerRoomUserJoinedPayload {
  participantId: string;
  name: string;
  role: ParticipantRole;
}

export interface ServerRoomUserLeftPayload {
  participantId: string;
  role: ParticipantRole;
}

export interface ServerRoomErrorPayload {
  message: string;
}

export interface ServerRoomClosedPayload {
  reason: string;
}

export interface ServerCodeChangedPayload {
  content: string;
  by: string;
}

export interface ServerChatMessagePayload {
  id: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface ServerTimerStartedPayload {
  duration: number;
  startedAt: string;
}

export interface ServerTimerPausedPayload {
  remaining: number;
}

export interface ServerTimerResumedPayload {
  remaining: number;
  startedAt: string;
}

export interface ServerLanguageChangedPayload {
  language: string;
  lastCode: string | null;
}
