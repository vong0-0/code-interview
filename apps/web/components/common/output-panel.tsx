"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { jetbrainsMono } from "@/lib/fonts";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OutputStatus = "idle" | "running" | "success" | "error";

export interface OutputLine {
  type: "stdout" | "stderr" | "info" | "success" | "error";
  content: string;
}

export interface OutputPanelProps {
  lines?: OutputLine[];
  status?: OutputStatus;
  className?: string;
}

// ─── Line styles ──────────────────────────────────────────────────────────────

const LINE_STYLES: Record<OutputLine["type"], string> = {
  stdout: "text-zinc-300",
  stderr: "text-red-400",
  info: "text-zinc-500",
  success: "text-green-400",
  error: "text-red-400",
};

// ─── Status bar ───────────────────────────────────────────────────────────────

function StatusBar({ status }: { status: OutputStatus }) {
  const config = {
    idle: {
      icon: null,
      label: "Ready",
      className: "text-zinc-500",
    },
    running: {
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      label: "Running...",
      className: "text-yellow-400",
    },
    success: {
      icon: <CheckCircle className="h-3.5 w-3.5" />,
      label: "Completed",
      className: "text-green-400",
    },
    error: {
      icon: <XCircle className="h-3.5 w-3.5" />,
      label: "Failed",
      className: "text-red-400",
    },
  }[status];

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OutputPanel({
  lines = [],
  status = "idle",
  className,
}: OutputPanelProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new output
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-[#111113] rounded-b-md overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 shrink-0">
        <span
          className={cn(
            jetbrainsMono.className,
            "text-xs font-bold uppercase tracking-widest text-zinc-400",
          )}
        >
          Output
        </span>
        <StatusBar status={status} />
      </div>

      {/* Output content */}
      <div className="flex-1 overflow-auto p-4">
        {lines.length === 0 ? (
          <p
            className={cn(
              jetbrainsMono.className,
              "text-xs text-zinc-600 select-none",
            )}
          >
            — Run your code to see output here —
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  jetbrainsMono.className,
                  "text-xs leading-relaxed whitespace-pre-wrap break-all",
                  LINE_STYLES[line.type],
                )}
              >
                {line.content}
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
