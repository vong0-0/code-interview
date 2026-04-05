"use client";

import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Step {
  title: string;
  description: string;
}

export interface StepListProps {
  steps: Step[];
  variant?: "default" | "compact" | "inline";
  className?: string;
}

// ─── Sub-component: single step item ─────────────────────────────────────────

interface StepItemProps {
  step: Step;
  index: number;
  isLast: boolean;
  variant: StepListProps["variant"];
}

function StepItem({ step, index, isLast, variant }: StepItemProps) {
  const isCompact = variant === "compact";

  return (
    <li className="group relative flex gap-4">
      {/* Column: badge + connector line */}
      <div className="flex flex-col items-center">
        {/* Step number badge — muted by default, primary on group hover */}
        <div
          className={cn(
            "relative z-10 flex shrink-0 items-center justify-center rounded-sm font-mono font-semibold tabular-nums transition-colors duration-200",
            "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground",
            isCompact ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs",
          )}
        >
          {index + 1}
        </div>

        {/* Connector line with gap from badge */}
        {!isLast && (
          <div
            aria-hidden
            className="mt-1.5 w-px flex-1 bg-border"
            style={{ minHeight: isCompact ? "2rem" : "2.5rem" }}
          />
        )}
      </div>

      {/* Content */}
      <div
        className={cn("min-w-0", isLast ? "pb-0" : isCompact ? "pb-5" : "pb-7")}
      >
        <p
          className={cn(
            "font-mono font-medium leading-tight tracking-tight text-foreground",
            isCompact ? "text-sm" : "text-base",
          )}
        >
          {step.title}
        </p>
        <p
          className={cn(
            "mt-1.5 leading-relaxed text-muted-foreground",
            isCompact ? "text-xs" : "text-sm",
          )}
        >
          {step.description}
        </p>
      </div>
    </li>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StepList({
  steps,
  variant = "default",
  className,
}: StepListProps) {
  if (variant === "inline") {
    return (
      <ol
        className={cn("flex flex-wrap items-start gap-x-8 gap-y-4", className)}
      >
        {steps.map((step, i) => (
          <li key={i} className="group flex items-start gap-3">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-sm font-mono text-xs font-semibold transition-colors duration-200",
                "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground",
              )}
            >
              {i + 1}
            </span>
            <div>
              <p className="font-mono font-medium leading-tight text-foreground">
                {step.title}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className={cn("flex flex-col", className)}>
      {steps.map((step, i) => (
        <StepItem
          key={i}
          step={step}
          index={i}
          isLast={i === steps.length - 1}
          variant={variant}
        />
      ))}
    </ol>
  );
}
