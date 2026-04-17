import * as React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@code-interview/types";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const difficultyConfig: Record<
  Difficulty,
  { label: string; className: string }
> = {
  EASY: {
    label: "Easy",
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-500 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-400",
  },
  MEDIUM: {
    label: "Medium",
    className:
      "border-orange-500/30 bg-orange-500/10 text-orange-500 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-400",
  },
  HARD: {
    label: "Hard",
    className:
      "border-red-500/30 bg-red-500/10 text-red-500 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400",
  },
};

export function DifficultyBadge({
  difficulty,
  className,
}: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty] || difficultyConfig.EASY;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-[4px] border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}
