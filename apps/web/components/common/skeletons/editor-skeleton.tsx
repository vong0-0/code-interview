import { Skeleton } from "@/components/ui/skeleton";

export function EditorSkeleton() {
  return (
    <div className="flex h-[300px] w-full flex-col gap-3 p-6 pt-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-12 bg-primary/10" />
        <Skeleton className="h-4 w-32 bg-muted/50" />
      </div>
      <div className="flex items-center gap-3 ml-6">
        <Skeleton className="h-4 w-24 bg-muted/50" />
      </div>
      <div className="flex items-center gap-3 ml-6">
        <Skeleton className="h-4 w-16 bg-muted/50" />
        <Skeleton className="h-4 w-40 bg-muted/50" />
      </div>
      <div className="flex items-center gap-3 ml-12">
        <Skeleton className="h-4 w-20 bg-muted/50" />
      </div>
      <div className="flex items-center gap-3 ml-6">
        <Skeleton className="h-4 w-28 bg-muted/50" />
      </div>
      <div className="flex items-center gap-3 mt-2">
        <Skeleton className="h-4 w-24 bg-primary/10" />
      </div>
    </div>
  );
}
