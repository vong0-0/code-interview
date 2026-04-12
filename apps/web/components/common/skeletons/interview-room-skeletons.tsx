import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

// ─── InterviewRoomCard Skeleton ───────────────────────────────────────────────

export function InterviewRoomCardSkeleton() {
  return (
    <Card className="rounded-xs">
      <CardHeader>
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-5 w-14 rounded-xs" />
          </div>
          {/* Code row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-8" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>
        </div>

        <Separator className="mt-4 mb-2" />

        {/* Language + Date */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 items-stretch rounded-none px-2 py-2.5 bg-slate-100 dark:bg-[#111113]">
        <Skeleton className="h-9 w-10 rounded-xs" />
        <Skeleton className="h-9 w-10 rounded-xs" />
        <Skeleton className="h-9 flex-1 rounded-xs" />
      </CardFooter>
    </Card>
  );
}

// ─── InterviewRoomList Skeleton ───────────────────────────────────────────────

export function InterviewRoomListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="my-12 grid grid-cols-1 @[600px]/main:grid-cols-2 @[900px]/main:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <InterviewRoomCardSkeleton key={i} />
      ))}
    </div>
  );
}
