"use client";

import { useFilterStore, useFilterUrlSync } from "@/app/hooks/use-filter-store";
import {
  CreateRoomButton,
  ResetFilterButton,
} from "@/components/common/buttons";
import { FacetedFilter } from "@/components/common/faceted-filter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/common/date-picker";
import { useDebounce } from "use-debounce";
import { DEBOUNCE_DELAY } from "@/app/constants/debounce";
import InterviewRoomCard from "@/components/common/interview-room-card";
import { EmptyState } from "@/components/common/empty-state";
import { StateOverviewSkeleton } from "@/components/common/skeletons/state-overview-skeletons";
import {
  useCreateRoom,
  useRoomOverview,
  useRooms,
} from "@/lib/hooks/use-rooms";
import { InterviewRoomListSkeleton } from "@/components/common/skeletons/interview-room-skeletons";
import { RoomFilters } from "@/lib/types/room.types";
import { InterviewRoomFormDialog } from "@/components/common/interview-room-form-dialog";
import { RoomFormValues } from "@/lib/schemas/room.schema";
import { DoorOpen } from "lucide-react";

const MOCK_STATE_OVERVIEW = {
  totalRooms: 124,
  openRoom: 60,
  closedRoom: 64,
};

export default function Page() {
  return (
    <>
      <PageHeader />
      <StateOverview />
      <FilterBar />
      <InterviewRoomList />
    </>
  );
}

function InterviewRoomList() {
  const { search, getFilter, hasFilters, resetFilters } = useFilterStore();
  const filters: RoomFilters = {
    search: search || undefined,
    status: getFilter<"OPEN" | "CLOSED">("status", [])[0],
    date: getFilter<string>("date", [])[0],
    dateFrom: getFilter<string>("dateFrom", [])[0],
    dateTo: getFilter<string>("dateTo", [])[0],
  };
  const { data: rooms, isLoading, error } = useRooms(filters);

  if (isLoading) return <InterviewRoomListSkeleton />;
  if (error) return <p>Error: {error.message}</p>;
  if (!rooms?.length)
    return (
      <EmptyState
        icon={DoorOpen}
        title={hasFilters ? "No rooms match your filters" : "No rooms found"}
        description={
          hasFilters
            ? "Try adjusting your search or filters."
            : "Create your first room to start conducting interviews."
        }
      />
    );

  return (
    <div className="my-12 grid grid-cols-1 @[600px]/main:grid-cols-2 @[900px]/main:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <InterviewRoomCard key={room.code} room={room} />
      ))}
    </div>
  );
}

function FilterBar() {
  const { search, setSearch, resetFilters } = useFilterStore();
  const [debouncedSearch] = useDebounce(search, DEBOUNCE_DELAY.search);

  useFilterUrlSync();

  return (
    <section id="filter-control">
      <div className="flex flex-col flex-wrap @[600px]/main:flex-row @[600px]/main:items-center @[600px]/main:justify-between gap-2">
        <Input
          className="max-w-[500px] bg-white h-100% dark:bg-black placeholder:text-sm"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex itesm-center gap-2">
          <FacetedFilter
            selectionMode="single"
            filterKey="status"
            title="Status"
            options={[
              { label: "Open", value: "OPEN" },
              { label: "Closed", value: "CLOSED" },
            ]}
            maxBadges={1}
          />

          <DatePicker
            filterKey="date"
            mode="single"
            serializeFormat="date"
            dateFormat="yyyy-MM-dd"
            clearable
            placeholder="Select date"
          />
          <ResetFilterButton onClick={resetFilters} />
        </div>
      </div>
    </section>
  );
}

function StateOverview() {
  const { overview, isLoading } = useRoomOverview();

  if (isLoading) return <StateOverviewSkeleton />;

  return (
    <section id="state-overview">
      <ul className="my-12 grid grid-cols-1 @[400px]/main:grid-cols-2 @[600px]/main:grid-cols-3 gap-4 **:data-[slot=card-title]:text-muted-foreground **:data-[slot=card-title]:text-sm **:data-[slot=card-title]:font-mono">
        <li>
          <Card id="total-rooms-card" className="rounded-xs px-3 py-6 gap-1">
            <CardHeader>
              <CardTitle>Total Rooms</CardTitle>
              <CardDescription className="sr-only">
                My total open and closed interview rooms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{overview.totalRooms}</p>
            </CardContent>
          </Card>
        </li>
        <li>
          <Card id="total-rooms-card" className="rounded-xs px-3 py-6 gap-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Open Rooms</CardTitle>
                {/* Open room indicator */}
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
              </div>
              <CardDescription className="sr-only">
                My open interview rooms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{overview.openRooms}</p>
            </CardContent>
          </Card>
        </li>
        <li>
          <Card id="total-rooms-card" className="rounded-xs px-3 py-6 gap-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Closed Rooms</CardTitle>
                {/* Closed room indicator */}
                <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
              </div>
              <CardDescription className="sr-only">
                My closed interview rooms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{overview.closedRooms}</p>
            </CardContent>
          </Card>
        </li>
      </ul>
    </section>
  );
}

function PageHeader() {
  const { mutateAsync: createRoom, isPending } = useCreateRoom();

  return (
    <>
      <section id="page-header">
        <div className="flex flex-col @[600px]/main:flex-row @[600px]/main:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">My Rooms</h1>
            <p className="text-muted-foreground text-sm">
              Manage your interview rooms and candidate evaluation environments.
            </p>
          </div>

          <InterviewRoomFormDialog
            mode="create"
            trigger={<CreateRoomButton className="w-auto" />}
            isSubmitting={isPending}
            onSubmit={async (values: RoomFormValues) => {
              await createRoom({
                title: values.title,
                language: values.language,
                roomDuration: values.roomDuration,
                questionId: values.question,
              });
            }}
          />
        </div>
      </section>
    </>
  );
}
