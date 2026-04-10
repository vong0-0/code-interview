"use client";

import * as React from "react";
import { addDays, format, parseISO, isValid } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/app/hooks/use-filter-store";

// ─── Serialize format ──────────────────────────────────────────────────────

/**
 * Controls how dates are stored inside useFilterStore (and therefore in the URL).
 *
 * | Value       | Example stored value         | Notes                       |
 * |-------------|------------------------------|-----------------------------|
 * | "iso"       | 2026-04-13T17:00:00.000Z     | Default — full ISO-8601     |
 * | "date"      | 2026-04-13                   | Date-only, no timezone shift|
 * | "timestamp" | 1744912800000                | Unix ms — good for APIs     |
 * | "custom"    | depends on `customFormat`    | Any date-fns format string  |
 */
export type SerializeFormat = "iso" | "date" | "timestamp" | "custom";

function serializeDate(
  date: Date,
  fmt: SerializeFormat,
  customFormat?: string,
): string {
  switch (fmt) {
    case "date":
      return format(date, "yyyy-MM-dd");
    case "timestamp":
      return date.getTime().toString();
    case "custom":
      return format(date, customFormat ?? "yyyy-MM-dd");
    case "iso":
    default:
      return date.toISOString();
  }
}

function deserializeDate(
  value: string,
  fmt: SerializeFormat,
): Date | undefined {
  if (!value) return undefined;
  let d: Date;
  switch (fmt) {
    case "timestamp":
      d = new Date(Number(value));
      break;
    case "date":
    case "custom":
    case "iso":
    default:
      d = parseISO(value);
      break;
  }
  return isValid(d) ? d : undefined;
}

// ─── Serialization helpers ─────────────────────────────────────────────────

function serializeSingle(
  date: Date | undefined,
  fmt: SerializeFormat,
  customFormat?: string,
): string[] {
  return date ? [serializeDate(date, fmt, customFormat)] : [];
}

function deserializeSingle(
  values: string[],
  fmt: SerializeFormat,
): Date | undefined {
  return values[0] ? deserializeDate(values[0], fmt) : undefined;
}

function serializeRange(
  range: DateRange | undefined,
  fmt: SerializeFormat,
  customFormat?: string,
): string[] {
  if (!range?.from) return [];
  const result = [serializeDate(range.from, fmt, customFormat)];
  if (range.to) result.push(serializeDate(range.to, fmt, customFormat));
  return result;
}

function deserializeRange(
  values: string[],
  fmt: SerializeFormat,
): DateRange | undefined {
  const from = values[0] ? deserializeDate(values[0], fmt) : undefined;
  const to = values[1] ? deserializeDate(values[1], fmt) : undefined;
  if (!from) return undefined;
  return { from, to: to ?? undefined };
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface DatePickerBaseProps {
  /** Display format passed to date-fns `format()`. Default: "LLL dd, y" */
  dateFormat?: string;
  /** Placeholder text shown when no date is selected */
  placeholder?: string;
  /** Disable the picker */
  disabled?: boolean;
  /** Show a clear (×) button when a date is selected */
  clearable?: boolean;
  /** Number of calendar months shown side-by-side */
  numberOfMonths?: number;
  /** Additional className for the trigger button */
  className?: string;
  /** Alignment of the popover */
  align?: "start" | "center" | "end";
  /**
   * Format used when serializing dates into useFilterStore / URL.
   * Only applies when `filterKey` is set. Default: "iso"
   *
   * - "iso"       → 2026-04-13T17:00:00.000Z
   * - "date"      → 2026-04-13
   * - "timestamp" → 1744912800000
   * - "custom"    → controlled by `customFormat`
   */
  serializeFormat?: SerializeFormat;
  /**
   * date-fns format string used when `serializeFormat="custom"`.
   * e.g. "dd/MM/yyyy", "MM-dd-yyyy"
   */
  customFormat?: string;
}

// ── Option A: controlled (value + onChange props from parent) ──

interface SingleControlledProps extends DatePickerBaseProps {
  mode: "single";
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  defaultValue?: Date;
  filterKey?: never;
}

interface RangeControlledProps extends DatePickerBaseProps {
  mode?: "range";
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  defaultValue?: DateRange;
  filterKey?: never;
}

// ── Option B: store-aware (reads/writes useFilterStore directly) ──

interface SingleStoreProps extends DatePickerBaseProps {
  mode: "single";
  /** Key used in useFilterStore.setFilter(filterKey, ...) */
  filterKey: string;
  value?: never;
  onChange?: never;
  defaultValue?: never;
}

interface RangeStoreProps extends DatePickerBaseProps {
  mode?: "range";
  /** Key used in useFilterStore.setFilter(filterKey, ...) */
  filterKey: string;
  value?: never;
  onChange?: never;
  defaultValue?: never;
}

export type DatePickerProps =
  | SingleControlledProps
  | RangeControlledProps
  | SingleStoreProps
  | RangeStoreProps;

// ─── Display helpers ───────────────────────────────────────────────────────

function formatSingle(date: Date | undefined, fmt: string): string | null {
  if (!date) return null;
  return format(date, fmt);
}

function formatRange(range: DateRange | undefined, fmt: string): string | null {
  if (!range?.from) return null;
  if (!range.to) return format(range.from, fmt);
  return `${format(range.from, fmt)} – ${format(range.to, fmt)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DatePicker(props: DatePickerProps) {
  const {
    dateFormat = "LLL dd, y",
    placeholder = "Pick a date",
    disabled = false,
    clearable = false,
    className,
    align = "start",
    serializeFormat = "iso",
    customFormat,
  } = props;

  const isRange = props.mode !== "single";
  const isStoreMode = "filterKey" in props && !!props.filterKey;

  // ── Store access (only used in store mode) ──
  // Select raw array reference from filters — avoids returning a new []
  // default on every render (which would cause an infinite snapshot loop).
  const storeValues = useFilterStore((s) =>
    isStoreMode
      ? (s.filters[props.filterKey!] as string[] | undefined)
      : undefined,
  );
  // Stable empty array fallback — never recreated between renders
  const EMPTY: string[] = React.useMemo(() => [], []);
  const resolvedStoreValues = storeValues ?? EMPTY;
  const setFilter = useFilterStore((s) => s.setFilter);

  // ── Internal state (uncontrolled fallback) ──
  const [internalSingle, setInternalSingle] = React.useState<Date | undefined>(
    !isStoreMode && props.mode === "single" ? props.defaultValue : undefined,
  );

  const [internalRange, setInternalRange] = React.useState<
    DateRange | undefined
  >(
    !isStoreMode && props.mode !== "single"
      ? (props.defaultValue ?? {
          from: new Date(new Date().getFullYear(), 0, 20),
          to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
        })
      : undefined,
  );

  // ── Resolve displayed value ──
  const singleDate: Date | undefined = isStoreMode
    ? deserializeSingle(resolvedStoreValues, serializeFormat)
    : props.mode === "single"
      ? (props.value ?? internalSingle)
      : undefined;

  const rangeDate: DateRange | undefined = isStoreMode
    ? deserializeRange(resolvedStoreValues, serializeFormat)
    : isRange
      ? ((props as RangeControlledProps).value ?? internalRange)
      : undefined;

  const numberOfMonths = props.numberOfMonths ?? (isRange ? 2 : 1);

  // ── Handlers ──
  const handleSingleSelect = (date: Date | undefined) => {
    if (isStoreMode) {
      setFilter(
        props.filterKey!,
        serializeSingle(date, serializeFormat, customFormat),
      );
    } else if (props.mode === "single") {
      setInternalSingle(date);
      props.onChange?.(date);
    }
  };

  const handleRangeSelect = (date: DateRange | undefined) => {
    if (isStoreMode) {
      setFilter(
        props.filterKey!,
        serializeRange(date, serializeFormat, customFormat),
      );
    } else {
      setInternalRange(date);
      (props as RangeControlledProps).onChange?.(date);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStoreMode) {
      setFilter(props.filterKey!, []);
    } else if (props.mode === "single") {
      setInternalSingle(undefined);
      props.onChange?.(undefined);
    } else {
      setInternalRange(undefined);
      (props as RangeControlledProps).onChange?.(undefined);
    }
  };

  // ── Label ──
  const label = isRange
    ? formatRange(rangeDate, dateFormat)
    : formatSingle(singleDate, dateFormat);

  const hasValue = isRange ? !!rangeDate?.from : !!singleDate;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "justify-start px-2.5 font-normal border border-dashed border-border! bg-white dark:bg-black",
            !label && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="flex-1 text-left truncate">
            {label ?? placeholder}
          </span>
          {clearable && hasValue && (
            <X
              className="ml-2 h-3.5 w-3.5 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 bg-white dark:bg-black"
        align={align}
      >
        {isRange ? (
          <Calendar
            mode="range"
            defaultMonth={rangeDate?.from}
            selected={rangeDate}
            onSelect={handleRangeSelect}
            numberOfMonths={numberOfMonths}
          />
        ) : (
          <Calendar
            mode="single"
            selected={singleDate}
            onSelect={handleSingleSelect}
            numberOfMonths={numberOfMonths}
            initialFocus
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

// ─── Convenience re-exports ───────────────────────────────────────────────────

export function SingleDatePicker(
  props: Omit<SingleControlledProps, "mode"> | Omit<SingleStoreProps, "mode">,
) {
  return <DatePicker {...(props as SingleControlledProps)} mode="single" />;
}

export function RangeDatePicker(
  props: Omit<RangeControlledProps, "mode"> | Omit<RangeStoreProps, "mode">,
) {
  return <DatePicker {...(props as RangeControlledProps)} mode="range" />;
}
