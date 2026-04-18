import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export function QuestionTableSkeleton({ className }: { className?: string }) {
  return (
    <Table
      className={cn(
        "w-full table-fixed rounded-md border",
        "min-w-[900px] @container-main:min-w-full",
        className,
      )}
    >
      <TableHeader>
        <TableRow
          className={cn(
            "bg-muted/50 **:data-[slot=table-head]:font-mono **:data-[slot=table-head]:text-[12px] **:data-[slot=table-head]:font-bold **:data-[slot=table-head]:uppercase",
            "**:data-[slot=table-head]:px-3 **:data-[slot=table-head]:py-2", // Small padding by default
            "@[800px]/main:**:data-[slot=table-head]:px-6 @[800px]/main:**:data-[slot=table-head]:py-4", // Larger on bigger container
          )}
        >
          <TableHead>Question & Description</TableHead>
          <TableHead className="w-[150px] @[800px]/main:w-[200px]">
            Difficulty
          </TableHead>
          <TableHead className="w-[150px] @[800px]/main:w-[200px] text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 3 }).map((_, i) => (
          <TableRow
            key={i}
            className={cn(
              "group hover:bg-muted/30",
              "**:data-[slot=table-cell]:px-3 **:data-[slot=table-cell]:py-3", // Small padding
              "@[800px]/main:**:data-[slot=table-cell]:px-6 @[800px]/main:**:data-[slot=table-cell]:py-4", // Large padding
            )}
          >
            <TableCell>
              <div className="flex flex-col gap-3 min-w-0 overflow-hidden">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-8 w-24" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
