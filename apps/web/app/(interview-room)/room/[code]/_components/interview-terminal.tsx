"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { jetbrainsMono } from "@/lib/fonts";
import { Terminal, CheckCircle2, Trash2 } from "lucide-react";

export interface TerminalLine {
  type: "stdout" | "stderr" | "system" | "success" | "command";
  content: string;
}

interface InterviewTerminalProps {
  lines: TerminalLine[];
  onClear?: () => void;
  onResizeStart?: () => void;
  onToggleMin?: () => void;
  isMinimized?: boolean;
  className?: string;
}

export function InterviewTerminal({
  lines,
  onClear,
  onResizeStart,
  onToggleMin,
  isMinimized,
  className,
}: InterviewTerminalProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, isMinimized]);

  return (
    <div className={cn(
      "flex flex-col h-full bg-card/60 dark:bg-[#0a0a0a] border-t border-border/50 relative", 
      className
    )}>
      {/* Invisible Resize Handle (Top Edge) */}
      <div 
        onPointerDown={onResizeStart}
        onDoubleClick={onToggleMin}
        className={cn(
          "absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize z-50",
          "hover:bg-primary/30 transition-colors active:bg-primary/50"
        )}
      />
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative py-2.5">
            <span className={cn(
              jetbrainsMono.className,
              "text-[11px] font-bold uppercase tracking-[0.2em]",
              isMinimized ? "text-muted-foreground/60" : "text-foreground"
            )}>
              Terminal
            </span>
            {/* Active Indicator Line */}
            {!isMinimized && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </div>
          {isMinimized && (
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">
              (Minimized)
            </span>
          )}
        </div>

        <button 
          onClick={onClear}
          title="Clear Terminal"
          className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-red-500"
          aria-label="Clear Terminal"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {/* Terminal Output */}
      {!isMinimized && (
        <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-white/10 animate-in fade-in duration-300">
          <div className="flex flex-col gap-1.5">
            {lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  jetbrainsMono.className,
                  "text-[13px] leading-relaxed whitespace-pre-wrap break-all flex gap-3",
                  line.type === "stderr" ? "text-red-400" : 
                  line.type === "success" ? "text-green-400" :
                  line.type === "command" ? "text-zinc-100" :
                  "text-zinc-400"
                )}
              >
                {line.type === "command" && (
                  <span className="text-emerald-400 shrink-0">→</span>
                )}
                {line.type === "success" && (
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  {line.type === "command" ? (
                    <>
                      <span className="text-emerald-400 font-bold mr-2">interview-os</span>
                      <span className="text-zinc-500 mr-2">git:(</span>
                      <span className="text-orange-400">main</span>
                      <span className="text-zinc-500 mr-2">)</span>
                      <span className="text-blue-400">{line.content}</span>
                    </>
                  ) : (
                    line.content
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  );
}
