import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { QuestionSummary } from "@code-interview/types";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, FileQuestion } from "lucide-react";
import { Button } from "../ui/button";
import { DifficultyBadge } from "./custom-badge";
import { QuestionTableSkeleton } from "../skeletons/question-table-skeleton";
import { EmptyState } from "./empty-state";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface QuestionTableProps extends React.ComponentProps<typeof Table> {
  questions?: QuestionSummary[];
  isLoading?: boolean;
}

export default function QuestionTable({
  questions,
  isLoading,
  className,
  ...props
}: QuestionTableProps) {
  if (isLoading) {
    return <QuestionTableSkeleton className={className} />;
  }

  if (!questions || questions.length === 0) {
    return <QuestionTableEmpty className={className} />;
  }

  return (
    <Table
      className={cn(
        "w-full table-fixed rounded-md border",
        "min-w-[900px] @container-main:min-w-full",
        className,
      )}
      {...props}
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
        {questions.map((question) => (
          <TableRow
            key={question.id}
            className={cn(
              "group hover:bg-muted/30",
              "**:data-[slot=table-cell]:px-3 **:data-[slot=table-cell]:py-3", // Small padding
              "@[800px]/main:**:data-[slot=table-cell]:px-6 @[800px]/main:**:data-[slot=table-cell]:py-4", // Large padding
            )}
          >
            <TableCell className="font-medium">
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="font-bold text-lg truncate">
                  {question.title}
                </span>
                <span className="text-sm text-muted-foreground font-normal truncate">
                  {question.description}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <DifficultyBadge difficulty={question.difficulty} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Link href={`/questions/${question.id}/edit`}>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function QuestionTableEmpty({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <EmptyState
      icon={FileQuestion}
      title="No questions found"
      description="Your question bank is empty or matches no filters. Start by adding your first coding question."
      action={{
        label: "Add Your First Question",
        variant: "outline",
        onClick: () => {
          router.push("/questions/new");
        },
      }}
      className={cn(
        "rounded-md border border-dashed bg-muted/10 p-12 py-24 animate-in fade-in zoom-in duration-300",
        className,
      )}
    />
  );
}
