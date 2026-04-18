import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldGroup } from "@/components/ui/field";

export function QuestionFormSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8 p-6", className)}>
      <FieldGroup className="flex flex-col gap-6 @[900px]/main:flex-row">
        <div className="space-y-8 w-full @[900px]/main:max-w-sm @[900px]/main:shrink-0">
          {/* Title Placeholder */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description Placeholder */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Difficulty Placeholder */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Language Placeholder */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Starter Code Placeholder */}
        <div className="w-full @[900px]/main:flex-1 space-y-2 flex flex-col">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-[350px] w-full" />
        </div>
      </FieldGroup>
    </div>
  );
}
