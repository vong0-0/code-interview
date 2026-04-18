import { RoomStatus } from "@code-interview/types";

export interface RoomFilters {
  search?: string;
  status?: RoomStatus;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
}
