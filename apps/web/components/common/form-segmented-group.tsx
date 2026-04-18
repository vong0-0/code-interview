import * as React from "react";
import { FieldValues, Path, Control } from "react-hook-form";
import { FormField } from "./form-field";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export interface SegmentedOption<V extends string> {
  value: V;
  label: string;
  activeClassName?: string;
}

interface FormSegmentedGroupProps<T extends FieldValues, V extends string> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  id: string;
  options: SegmentedOption<V>[];
  className?: string;
  orientation?: "vertical" | "responsive";
}

export function FormSegmentedGroup<T extends FieldValues, V extends string>({
  name,
  control,
  label,
  id,
  options,
  className,
  orientation = "vertical",
}: FormSegmentedGroupProps<T, V>) {
  return (
    <FormField
      name={name}
      control={control}
      label={label}
      id={id}
      orientation={orientation}
    >
      {(field) => (
        <div className={cn("flex flex-wrap gap-2", className)}>
          {options.map((option) => {
            const isActive = field.value === option.value;
            return (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                className={cn(
                  "flex-1 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200",
                  "px-4 py-2.5 h-auto rounded-sm text-xs",
                  isActive
                    ? cn("border-primary text-primary", option.activeClassName)
                    : "text-muted-foreground hover:bg-muted/50",
                )}
                onClick={() => field.onChange(option.value)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      )}
    </FormField>
  );
}
