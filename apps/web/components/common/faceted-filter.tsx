import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useFilterStore } from "@/app/hooks/use-filter-store";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FacetedFilterOption<T extends string> {
  label: string;
  value: T;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FacetedFilterBaseProps<T extends string> {
  /** Label shown on the trigger button */
  title: string;
  /** List of options to display */
  options: FacetedFilterOption<T>[];
  /**
   * Custom renderer for the icon/indicator next to each option label.
   * Receives the option value; takes priority over `option.icon`.
   */
  renderIcon?: (value: T) => React.ReactNode;
  /**
   * "multiple" (default) — any number of options can be selected.
   * "single"             — selecting one deselects the others.
   */
  selectionMode?: "multiple" | "single";
  /**
   * Max number of individual badges shown in the trigger before collapsing
   * to "{n} selected". Default: 2.
   */
  maxBadges?: number;
  /**
   * Facet counts shown next to each option label, e.g. { open: 60, closed: 64 }.
   * Usually produced by useFilterStore.computeFacets().
   */
  facets?: Record<string, number>;
  /** Alignment of the popover. Default: "start" */
  align?: "start" | "center" | "end";
  /** Width of the popover (Tailwind class or CSS value). Default: "200px" */
  popoverWidth?: string;
}

// ── Option A: controlled (selected + setSelected from parent) ──

interface ControlledProps<T extends string> extends FacetedFilterBaseProps<T> {
  selected: T[];
  setSelected: (value: T[]) => void;
  filterKey?: never;
}

// ── Option B: store-aware (reads/writes useFilterStore directly) ──

interface StoreProps<T extends string> extends FacetedFilterBaseProps<T> {
  /** Key used in useFilterStore.setFilter(filterKey, ...) */
  filterKey: string;
  selected?: never;
  setSelected?: never;
}

export type FacetedFilterProps<T extends string> =
  | ControlledProps<T>
  | StoreProps<T>;

// ─── Component ────────────────────────────────────────────────────────────────

export function FacetedFilter<T extends string>(props: FacetedFilterProps<T>) {
  const {
    title,
    options,
    renderIcon,
    selectionMode = "multiple",
    maxBadges = 2,
    facets,
    align = "start",
    popoverWidth = "200px",
  } = props;

  const isStoreMode = "filterKey" in props && !!props.filterKey;

  // ── Store access ──
  // Select raw array reference to avoid infinite snapshot loop (same pattern as DatePicker)
  const storeValues = useFilterStore((s) =>
    isStoreMode ? (s.filters[props.filterKey!] as T[] | undefined) : undefined,
  );
  const EMPTY = React.useMemo((): T[] => [], []);
  const resolvedStoreValues = storeValues ?? EMPTY;
  const setFilter = useFilterStore((s) => s.setFilter);

  // ── Resolve selected ──
  // Cast needed because TypeScript can't narrow union props through a boolean flag —
  // `isStoreMode` is not a type guard, so `props.selected` still types as `T[] | undefined`.
  const selected: T[] = isStoreMode
    ? resolvedStoreValues
    : ((props as ControlledProps<T>).selected ?? EMPTY);

  const setSelected = React.useCallback(
    (next: T[]) => {
      if (isStoreMode) {
        setFilter(props.filterKey!, next);
      } else {
        (props as ControlledProps<T>).setSelected(next);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isStoreMode, props.filterKey, setFilter],
  );

  // ── Toggle logic ──
  function toggle(value: T) {
    if (selectionMode === "single") {
      // Clicking the already-selected item deselects it
      setSelected(selected.includes(value) ? [] : [value]);
    } else {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      setSelected(next);
    }
  }

  // ── Badge rendering ──
  const selectedOptions = options.filter((o) => selected.includes(o.value));

  const triggerBadges =
    selectedOptions.length > maxBadges ? (
      <Badge variant="secondary" className="rounded-sm px-1 font-normal">
        {selectedOptions.length} selected
      </Badge>
    ) : (
      selectedOptions.map((opt) => (
        <Badge
          key={opt.value}
          variant="secondary"
          className="rounded-sm px-1 font-normal"
        >
          {opt.label}
        </Badge>
      ))
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed border-border! bg-white dark:bg-black"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selected.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-full" />
              {triggerBadges}
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        style={{ width: popoverWidth }}
        className="p-0 bg-white dark:bg-black"
        align={align}
      >
        <Command className="**:data-[slot=input-group]:bg-background">
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                const count = facets?.[option.value];

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggle(option.value)}
                  >
                    {/* Single-select: radio dot; multiple: checkbox */}
                    {selectionMode === "single" ? (
                      <span
                        className={[
                          "mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border",
                          isSelected
                            ? "bg-primary border-primary"
                            : "bg-transparent",
                        ].join(" ")}
                      >
                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                    ) : (
                      <Checkbox
                        checked={isSelected}
                        className="mr-2 border-border"
                      />
                    )}

                    {/* Icon: renderIcon takes priority over option.icon */}
                    {renderIcon
                      ? renderIcon(option.value)
                      : option.icon && (
                          <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}

                    <span className="flex-1">{option.label}</span>

                    {/* Facet count */}
                    {count !== undefined && (
                      <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                        {count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelected([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
