"use client";

import { cn } from "@/lib/utils";

export function EditorSkeleton() {
  return (
    <div className="flex h-full w-full animate-pulse flex-col bg-card/30 backdrop-blur-sm">
      {/* ── Fake Code Lines ── */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex items-center gap-4">
            {/* Line Number Placeholder */}
            <div className="h-4 w-4 rounded bg-muted/40" />
            
            {/* Code Bar Placeholder with random widths */}
            <div
              className={cn(
                "h-4 rounded bg-muted/30",
                i % 3 === 0 ? "w-[60%]" : i % 2 === 0 ? "w-[80%]" : "w-[40%]"
              )}
            />
          </div>
        ))}
      </div>
      
      {/* ── Bottom Status Bar Concept ── */}
      <div className="h-4 w-full bg-muted/10 border-t border-border/10" />
    </div>
  );
}
