"use client";

import { DEBOUNCE_DELAY } from "@/app/constants/debounce";
import { useFilterStore, useFilterUrlSync } from "@/app/hooks/use-filter-store";
import {
  CreateRoomButton,
  ResetFilterButton,
} from "@/components/common/buttons";
import { FacetedFilter } from "@/components/common/faceted-filter";
import QuestionTable from "@/components/common/question-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { MOCK_QUESTIONS } from "./mock-data";
import { useRouter } from "next/navigation";

export default function QuestionBankPage() {
  return (
    <>
      <PageHeader />
      <StateOverview />
      <FilterBar />
      <QuestionList />
    </>
  );
}

function QuestionList() {
  return (
    <section id="question-list" className="my-6">
      <QuestionTable questions={MOCK_QUESTIONS} />
    </section>
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
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex itesm-center gap-2">
          <FacetedFilter
            selectionMode="multiple"
            filterKey="difficulty"
            title="Difficulty"
            options={[
              { label: "Easy", value: "EASY" },
              { label: "Medium", value: "MEDIUM" },
              { label: "Hard", value: "HARD" },
            ]}
            maxBadges={1}
          />
          <ResetFilterButton onClick={resetFilters} />
        </div>
      </div>
    </section>
  );
}

function StateOverview() {
  return (
    <section id="state-overview">
      <ul className="my-12 grid grid-cols-1 @[400px]/main:grid-cols-2 @[600px]/main:grid-cols-4 gap-4 **:data-[slot=card-title]:text-muted-foreground **:data-[slot=card-title]:text-sm **:data-[slot=card-title]:font-mono">
        <li>
          <Card id="total-rooms-card" className="rounded-xs px-3 py-6 gap-1">
            <CardHeader>
              <CardTitle>Total Rooms</CardTitle>
              <CardDescription className="sr-only">
                My total open and closed interview rooms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{66}</p>
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
              <p className="text-3xl font-bold">{22}</p>
            </CardContent>
          </Card>
        </li>
        <li>
          <Card id="total-rooms-card" className="rounded-xs px-3 py-6 gap-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Closed Rooms</CardTitle>
                {/* Closed room indicator */}
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-600"></div>
              </div>
              <CardDescription className="sr-only">
                My closed interview rooms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{22}</p>
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
              <p className="text-3xl font-bold">{22}</p>
            </CardContent>
          </Card>
        </li>
      </ul>
    </section>
  );
}

function PageHeader() {
  const router = useRouter();
  return (
    <>
      <section id="page-header">
        <div className="flex flex-col @[600px]/main:flex-row @[600px]/main:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Question Bank</h1>
            <p className="text-muted-foreground text-sm">
              Manage your coding questions library
            </p>
          </div>

          <CreateRoomButton
            className="w-auto"
            onClick={() => router.push("/question-bank/create")}
          />
        </div>
      </section>
    </>
  );
}
