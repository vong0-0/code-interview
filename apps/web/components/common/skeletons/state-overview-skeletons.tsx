// ─── StateOverview Card Skeleton ──────────────────────────────────────────────

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StateOverviewCardSkeleton() {
  return (
    <Card className="rounded-xs px-3 py-6 gap-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-9 w-12" />
      </CardContent>
    </Card>
  );
}

// ─── StateOverview Skeleton ───────────────────────────────────────────────────

export function StateOverviewSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="my-12 grid grid-cols-1 @[400px]/main:grid-cols-2 @[600px]/main:grid-cols-3 @[800px]/main:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <StateOverviewCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
