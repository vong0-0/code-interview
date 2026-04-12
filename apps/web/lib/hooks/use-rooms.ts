import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roomService, roomKeys } from "@/lib/services/room.service";
import { RoomFilters } from "../types/room.types";
import { RoomFormPayload } from "../schemas/room.schema";

export function useRooms(filters?: RoomFilters) {
  return useQuery({
    queryKey: roomKeys.list(filters ?? {}),
    queryFn: () => roomService.getAll(filters),
  });
}
export function useRoomOverview() {
  const { data: rooms, isLoading } = useQuery({
    queryKey: roomKeys.list({}),
    queryFn: () => roomService.getAll(),
  });

  const overview = {
    totalRooms: rooms?.length ?? 0,
    openRooms: rooms?.filter((r) => r.status === "OPEN").length ?? 0,
    closedRooms: rooms?.filter((r) => r.status === "CLOSED").length ?? 0,
  };

  return { overview, isLoading };
}

export function useRoom(code: string) {
  return useQuery({
    queryKey: roomKeys.detail(code),
    queryFn: () => roomService.getOne(code),
    enabled: !!code,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RoomFormPayload) => roomService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      code,
      payload,
    }: {
      code: string;
      payload: RoomFormPayload;
    }) => roomService.update(code, payload),
    onSuccess: (_, { code }) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(code) });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => roomService.delete(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useCloseRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) =>
      roomService.update(code, { status: "CLOSED" }),
    onSuccess: (_, code) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(code) });
    },
  });
}
