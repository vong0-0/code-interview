"use client";
import { Difficulty } from "@code-interview/types";

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
import { useRouter } from "next/navigation";
import { useQuestions, useQuestionOverview } from "@/lib/hooks/use-questions";
import { Skeleton } from "@/components/ui/skeleton";
import { StateOverviewSkeleton } from "@/components/common/skeletons/state-overview-skeletons";

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
  const { search, getFilter } = useFilterStore();
  const difficultyFilter = getFilter("difficulty", []);
  const difficulty = (
    difficultyFilter.length > 0 ? difficultyFilter[0] : undefined
  ) as Difficulty | undefined;

  const { data: questions, isLoading } = useQuestions({
    search,
    difficulty,
  });

  return (
    <section id="question-list" className="my-6">
      <QuestionTable questions={questions || []} isLoading={isLoading} />
    </section>
  );
}

function FilterBar() {
  const { search, setSearch, resetFilters } = useFilterStore();

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
  const { overview, isLoading } = useQuestionOverview();

  if (isLoading) return <StateOverviewSkeleton count={4} />;

  return (
    <section id="state-overview">
      <ul className="my-12 grid grid-cols-1 @[400px]/main:grid-cols-2 @[600px]/main:grid-cols-4 gap-4 **:data-[slot=card-title]:text-muted-foreground **:data-[slot=card-title]:text-sm **:data-[slot=card-title]:font-mono">
        <li>
          <Card
            id="total-questions-card"
            className="rounded-xs px-3 py-6 gap-1 border-t-2 border-t-primary/20"
          >
            <CardHeader>
              <CardTitle>Total Questions</CardTitle>
              <CardDescription className="sr-only">
                Total questions in bank
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <p className="text-3xl font-bold">{overview.totalQuestions}</p>
              )}
            </CardContent>
          </Card>
        </li>
        <li>
          <Card
            id="easy-questions-card"
            className="rounded-xs px-3 py-6 gap-1 border-t-2 border-t-blue-500/50 hover:border-t-blue-500 transition-colors"
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Easy</CardTitle>
              </div>
              <CardDescription className="sr-only">
                Easy difficulty questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <p className="text-3xl font-bold">{overview.easyQuestions}</p>
              )}
            </CardContent>
          </Card>
        </li>
        <li>
          <Card
            id="medium-questions-card"
            className="rounded-xs px-3 py-6 gap-1 border-t-2 border-t-orange-500/50 hover:border-t-orange-500 transition-colors"
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Medium</CardTitle>
              </div>
              <CardDescription className="sr-only">
                Medium difficulty questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <p className="text-3xl font-bold">{overview.mediumQuestions}</p>
              )}
            </CardContent>
          </Card>
        </li>
        <li>
          <Card
            id="hard-questions-card"
            className="rounded-xs px-3 py-6 gap-1 border-t-2 border-t-red-500/50 hover:border-t-red-500 transition-colors"
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Hard</CardTitle>
              </div>
              <CardDescription className="sr-only">
                Hard difficulty questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <p className="text-3xl font-bold">{overview.hardQuestions}</p>
              )}
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
