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
      "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-500",
  },
  MEDIUM: {
    label: "Medium",
    className: "border-orange-500/20 bg-orange-500/10 text-orange-500",
  },
  HARD: {
    label: "Hard",
    className: "border-red-500/20 bg-red-500/10 text-red-500",
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
        "rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}

