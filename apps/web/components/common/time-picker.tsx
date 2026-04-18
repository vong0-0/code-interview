"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimePickerMode = "time" | "duration";
export type TimePickerOutput = "ms" | "string";

interface TimePickerProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  mode?: TimePickerMode;
  outputFormat?: TimePickerOutput;
  format?: "HH:mm" | "HH:mm:ss";
  use12Hour?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad = (n: number) => n.toString().padStart(2, "0");

const parseValue = (value: string | number | undefined, use12Hour: boolean, mode: TimePickerMode = "time") => {
  if (value === undefined || value === "") return { hours: 0, minutes: 0, seconds: 0, ampm: "AM" };
  
  if (typeof value === "number") {
    const totalSeconds = Math.floor(value / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    let h = Math.floor(m / 60);
    const mins = m % 60;
    let ampm = "AM";

    if (use12Hour && mode === "time") {
      ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;
    } else if (mode === "time") {
      h = h % 24;
    }
    // Else if duration, h is not capped
    return { hours: h, minutes: mins, seconds: s, ampm };
  }

  // String format assumes "HH:mm:ss AM" or "HH:mm"
  const [time, ampmPart] = value.split(" ");
  const parts = time.split(":").map(Number);
  const h = parts[0] || 0;
  const m = parts[1] || 0;
  const s = parts[2] || 0;
  const ampm = ampmPart || (h >= 12 ? "PM" : "AM");

  return { hours: h, minutes: m, seconds: s, ampm };
};

// ... (TimeSegment with dynamic width) ...
// Update TimeSegment className for flexibility
// className="min-w-[2ch] w-fit bg-transparent text-center focus:outline-none focus:text-primary font-medium tabular-nums selection:bg-primary/20"

// ... (TimePicker logic) ...

// ─── Internal Segment Component ───────────────────────────────────────────────

interface TimeSegmentProps {
  value: number;
  onChange: (val: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  max: number;
  min: number;
  label: string;
  disabled?: boolean;
  id?: string;
  autoNext?: boolean;
}

const TimeSegment = React.forwardRef<HTMLInputElement, TimeSegmentProps>(
  ({ value, onChange, onNext, onPrev, max, min, label, disabled, id, autoNext = true }, ref) => {
    const [localValue, setLocalValue] = React.useState(pad(value));

    React.useEffect(() => {
      setLocalValue(pad(value));
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        onChange(value >= max ? min : value + 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        onChange(value <= min ? max : value - 1);
      } else if (e.key === "Backspace" && localValue === "00" && onPrev) {
        onPrev();
      } else if (e.key === "ArrowRight" && onNext) {
        onNext();
      } else if (e.key === "ArrowLeft" && onPrev) {
        onPrev();
      } else if (e.key === ":" && onNext) {
        e.preventDefault();
        onNext();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, "");
      if (val.length === 0) {
        setLocalValue("");
        return;
      }

      const num = parseInt(val, 10);
      if (!isNaN(num)) {
        if (num <= max) {
          onChange(num);
          // Auto-next if enabled and we've typed enough digits for the max value
          if (autoNext) {
            const maxDigits = max.toString().length;
            if (val.length >= maxDigits && onNext) onNext();
          }
        }
      }
    };

    return (
      <input
        ref={ref}
        id={id}
        type="text"
        inputMode="numeric"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        className="min-w-[2ch] w-fit bg-transparent text-center focus:outline-none focus:text-primary font-medium tabular-nums selection:bg-primary/20"
        aria-label={label}
      />
    );
  }
);
TimeSegment.displayName = "TimeSegment";

// ─── AM/PM Segment ────────────────────────────────────────────────────────────

const AMPMSegment = React.forwardRef<HTMLInputElement, { 
  value: string; 
  onChange: (val: string) => void; 
  onPrev?: () => void;
  disabled?: boolean;
}>(({ value, onChange, onPrev, disabled }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "a" || e.key === "p" || e.key === "A" || e.key === "P") {
      e.preventDefault();
      onChange(value === "AM" ? "PM" : "AM");
    } else if (e.key === "ArrowLeft" && onPrev) {
      onPrev();
    } else if (e.key === "Backspace" && onPrev) {
        onPrev();
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      readOnly
      onKeyDown={handleKeyDown}
      disabled={disabled}
      onFocus={(e) => e.target.select()}
      className="w-[3ch] bg-transparent text-center focus:outline-none focus:text-primary font-bold selection:bg-primary/20 cursor-pointer"
      aria-label="AM/PM"
    />
  );
});
AMPMSegment.displayName = "AMPMSegment";

// ─── Main Component ──────────────────────────────────────────────────────────

export function TimePicker({
  value,
  onChange,
  mode = "time",
  outputFormat = "string",
  format,
  use12Hour = false,
  disabled = false,
  className,
  id,
}: TimePickerProps) {
  // If mode is duration, enforce HH:mm:ss unless explicitly overridden
  const resolvedFormat = format ?? (mode === "duration" ? "HH:mm:ss" : "HH:mm");
  
  const parts = React.useMemo(() => parseValue(value, use12Hour, mode), [value, use12Hour, mode]);
  
  const hourRef = React.useRef<HTMLInputElement>(null);
  const minRef = React.useRef<HTMLInputElement>(null);
  const secRef = React.useRef<HTMLInputElement>(null);
  const ampmRef = React.useRef<HTMLInputElement>(null);

  const update = (newParts: Partial<typeof parts>) => {
    const finalParts = { ...parts, ...newParts };
    
    if (outputFormat === "ms") {
      let h = finalParts.hours;
      if (use12Hour && mode === "time") {
        if (finalParts.ampm === "PM" && h < 12) h += 12;
        if (finalParts.ampm === "AM" && h === 12) h = 0;
      }
      const ms = (h * 3600 + finalParts.minutes * 60 + finalParts.seconds) * 1000;
      onChange?.(ms);
    } else {
      const padNum = (n: number) => n.toString().padStart(2, "0");
      const hStr = mode === "duration" ? finalParts.hours.toString().padStart(2, "0") : padNum(finalParts.hours);
      
      let res = `${hStr}:${padNum(finalParts.minutes)}`;
      if (resolvedFormat === "HH:mm:ss") res += `:${padNum(finalParts.seconds)}`;
      if (use12Hour && mode === "time") res += ` ${finalParts.ampm}`;
      onChange?.(res);
    }
  };

  const maxHours = mode === "duration" ? 999 : (use12Hour ? 12 : 23);

  return (
    <div 
      className={cn(
        "flex h-10 w-full items-center rounded-sm border-2 border-muted bg-transparent px-4 py-2 text-sm transition-colors focus-within:border-ring",
        disabled && "pointer-events-none opacity-50 bg-input/50",
        className
      )}
      onClick={() => hourRef.current?.focus()}
    >
      <TimeSegment
        id={id}
        ref={hourRef}
        value={parts.hours}
        onChange={(h) => update({ hours: h })}
        onNext={() => minRef.current?.focus()}
        min={use12Hour && mode === "time" ? 1 : 0}
        max={maxHours}
        label="hours"
        disabled={disabled}
        autoNext={mode !== "duration"}
      />
      <span className="mx-0.5 text-muted-foreground select-none">:</span>
      <TimeSegment
        ref={minRef}
        value={parts.minutes}
        onChange={(m) => update({ minutes: m })}
        onNext={() => (resolvedFormat === "HH:mm:ss" ? secRef.current?.focus() : use12Hour ? ampmRef.current?.focus() : null)}
        onPrev={() => hourRef.current?.focus()}
        min={0}
        max={59}
        label="minutes"
        disabled={disabled}
      />
      {resolvedFormat === "HH:mm:ss" && (
        <>
          <span className="mx-0.5 text-muted-foreground select-none">:</span>
          <TimeSegment
            ref={secRef}
            value={parts.seconds}
            onChange={(s) => update({ seconds: s })}
            onNext={() => (use12Hour ? ampmRef.current?.focus() : null)}
            onPrev={() => minRef.current?.focus()}
            min={0}
            max={59}
            label="seconds"
            disabled={disabled}
          />
        </>
      )}
      {use12Hour && (
        <>
          <span className="ml-auto flex items-center gap-1 pl-2">
            <span className="h-4 w-px bg-muted" />
            <AMPMSegment
              ref={ampmRef}
              value={parts.ampm}
              onChange={(a) => update({ ampm: a })}
              onPrev={() => (resolvedFormat === "HH:mm:ss" ? secRef.current?.focus() : minRef.current?.focus())}
              disabled={disabled}
            />
          </span>
        </>
      )}
    </div>
  );
}



