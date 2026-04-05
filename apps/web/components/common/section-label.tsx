import { cn } from "@/lib/utils";
import { jetbrainsMono } from "@/lib/fonts";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        jetbrainsMono.className,
        "text-xs font-medium uppercase tracking-widest text-muted-foreground",
        className,
      )}
    >
      <span className="text-primary">
        {"//"}
        {children}
      </span>
    </p>
  );
}
