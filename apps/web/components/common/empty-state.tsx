import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "ghost";
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
  size?: "sm" | "default" | "lg";
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center text-center",
        {
          "gap-2 py-8": size === "sm",
          "gap-3 py-16": size === "default",
          "gap-4 py-24": size === "lg",
        },
        className,
      )}
    >
      {/* Icon */}
      {Icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-xl border border-dashed border-border bg-muted text-muted-foreground",
            {
              "h-10 w-10": size === "sm",
              "h-14 w-14": size === "default",
              "h-16 w-16": size === "lg",
            },
          )}
        >
          <Icon
            className={cn({
              "h-4 w-4": size === "sm",
              "h-6 w-6": size === "default",
              "h-7 w-7": size === "lg",
            })}
          />
        </div>
      )}

      {/* Text */}
      <div className="flex flex-col gap-1">
        <p
          className={cn("font-medium text-foreground", {
            "text-sm": size === "sm",
            "text-base": size === "default",
            "text-lg": size === "lg",
          })}
        >
          {title}
        </p>
        {description && (
          <p
            className={cn("text-muted-foreground", {
              "text-xs": size === "sm",
              "text-sm": size === "default",
              "text-base": size === "lg",
            })}
          >
            {description}
          </p>
        )}
      </div>

      {/* Action */}
      {action && (
        <Button
          variant={action.variant ?? "outline"}
          size={size === "sm" ? "sm" : "default"}
          onClick={action.onClick}
          {...(action.href ? { asChild: true } : {})}
        >
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  );
}
