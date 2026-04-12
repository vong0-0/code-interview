import { api } from "@/lib/api";
import type { RoomDetail, RoomSummary } from "@code-interview/types";
import { RoomFilters } from "../types/room.types";
import { CloseRoomPayload, RoomFormPayload } from "../schemas/room.schema";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const roomKeys = {
  all: ["rooms"] as const,
  lists: () => [...roomKeys.all, "list"] as const,
  list: (filters: RoomFilters) => [...roomKeys.lists(), filters] as const,
  detail: (code: string) => [...roomKeys.all, "detail", code] as const,
};

// ─── Service ──────────────────────────────────────────────────────────────────

export const roomService = {
  getAll: async (filters?: RoomFilters): Promise<RoomSummary[]> => {
    const { data } = await api.get("/rooms", { params: filters });
    return data.rooms;
  },
  getOne: async (code: string): Promise<RoomDetail> => {
    const { data } = await api.get(`/rooms/${code}`);
    return data.room;
  },

  create: async (payload: RoomFormPayload): Promise<RoomDetail> => {
    const { data } = await api.post("/rooms", payload);
    return data.room;
  },

  update: async (
    code: string,
    payload: RoomFormPayload | CloseRoomPayload,
  ): Promise<RoomDetail> => {
    const { data } = await api.put(`/rooms/${code}`, payload);
    return data.room;
  },

  delete: async (code: string): Promise<void> => {
    await api.delete(`/rooms/${code}`);
  },
};
