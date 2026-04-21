"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { jetbrainsMono } from "@/lib/fonts";
import { Play, Pause, Square, RotateCcw, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimerMode = "countdown" | "stopwatch";
export type TimerStatus = "idle" | "running" | "paused" | "finished";

export interface TimerProps {
  /** milliseconds — default 60000 (1 min) */
  duration?: number;
  mode?: TimerMode;
  /** Controlled status — if provided, disables internal state */
  status?: TimerStatus;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onFinish?: () => void;
  onTick?: (ms: number) => void;
  /** Show control buttons */
  showControls?: boolean;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function msToDisplay(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return {
    h: h.toString().padStart(2, "0"),
    m: m.toString().padStart(2, "0"),
    s: s.toString().padStart(2, "0"),
    showHours: h > 0,
  };
}

function getColorClass(ms: number, duration: number, mode: TimerMode): string {
  if (mode === "stopwatch") return "text-foreground";
  const ratio = ms / duration;
  if (ratio <= 0.1) return "text-destructive";
  // Default to orange for countdown
  return "text-warning";
}

// ─── Timer display ────────────────────────────────────────────────────────────

function TimerDisplay({
  ms,
  duration,
  mode,
}: {
  ms: number;
  duration: number;
  mode: TimerMode;
}) {
  const { h, m, s, showHours } = msToDisplay(ms);
  const colorClass = getColorClass(ms, duration, mode);

  return (
    <span
      className={cn(
        jetbrainsMono.className,
        "tabular-nums font-bold tracking-tight text-lg",
        colorClass,
      )}
    >
      {showHours && <>{h}:</>}
      {m}:{s}
    </span>
  );
}

// ─── Control buttons ──────────────────────────────────────────────────────────

function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  onFinish,
}: {
  status: TimerStatus;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onFinish?: () => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {/* idle → Start */}
      {status === "idle" && (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={onStart}
          title="Start"
        >
          <Play className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* running → Pause + Finish */}
      {status === "running" && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={onPause}
            title="Pause"
          >
            <Pause className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={onFinish}
            title="Finish"
          >
            <FastForward className="h-3.5 w-3.5" />
          </Button>
        </>
      )}

      {/* paused → Continue + Stop */}
      {status === "paused" && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={onResume}
            title="Continue"
          >
            <Play className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={handleStop}
            title="Stop"
          >
            <Square className="h-3.5 w-3.5" />
          </Button>
        </>
      )}

      {/* finished → Reset */}
      {status === "finished" && (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={handleStop}
          title="Reset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );

  // Helper for internal stop logic within subcomponent scope
  function handleStop() {
    onStop?.();
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Timer({
  duration = 60_000,
  mode = "countdown",
  status: controlledStatus,
  onStart,
  onPause,
  onResume,
  onStop,
  onFinish,
  onTick,
  showControls = true,
  className,
}: TimerProps) {
  // Internal status — used when no controlled status provided
  const [internalStatus, setInternalStatus] =
    React.useState<TimerStatus>("idle");
  const status = controlledStatus ?? internalStatus;

  const [elapsed, setElapsed] = React.useState(0);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = React.useRef<number | null>(null);
  const pausedAtRef = React.useRef<number>(0);

  // If controlledStatus is provided, we use duration directly as the source of truth
  // to avoid double-decrementing when used with synchronized hooks.
  const currentMs = controlledStatus 
    ? duration 
    : (mode === "countdown" ? Math.max(0, duration - elapsed) : elapsed);

  // ── Tick logic ──
  React.useEffect(() => {
    if (status === "running") {
      startTimeRef.current = Date.now() - pausedAtRef.current;

      intervalRef.current = setInterval(() => {
        const newElapsed = Date.now() - (startTimeRef.current ?? Date.now());
        setElapsed(newElapsed);
        pausedAtRef.current = newElapsed;

        const tickMs =
          mode === "countdown"
            ? Math.max(0, duration - newElapsed)
            : newElapsed;
        onTick?.(tickMs);

        if (mode === "countdown" && newElapsed >= duration) {
          clearInterval(intervalRef.current!);
          setInternalStatus("finished");
          onFinish?.();
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (status === "idle") {
        setElapsed(0);
        pausedAtRef.current = 0;
        startTimeRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, duration, mode, onTick, onFinish]);

  // ── Internal handlers (uncontrolled mode) ──
  function handleStart() {
    setInternalStatus("running");
    onStart?.();
  }

  function handlePause() {
    setInternalStatus("paused");
    onPause?.();
  }

  function handleResume() {
    setInternalStatus("running");
    onResume?.();
  }

  function handleStop() {
    setInternalStatus("idle");
    setElapsed(0);
    pausedAtRef.current = 0;
    onStop?.();
  }

  function handleFinish() {
    setInternalStatus("finished");
    onFinish?.();
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TimerDisplay ms={currentMs} duration={duration} mode={mode} />

      {showControls && (
        <TimerControls
          status={status}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
}
