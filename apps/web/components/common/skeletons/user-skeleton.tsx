import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function UserAvatarSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={cn("h-8 w-8 rounded-full", className)} />
  );
}
