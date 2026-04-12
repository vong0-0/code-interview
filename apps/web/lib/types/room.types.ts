export interface RoomFilters {
  search?: string;
  status?: "OPEN" | "CLOSED";
  date?: string;
  dateFrom?: string;
  dateTo?: string;
}
