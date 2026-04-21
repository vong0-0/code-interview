"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { FieldValues, Path, Control } from "react-hook-form";
import { FormField, Orientation } from "./form-field";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  label: string;
  value: string;
}

interface FormComboboxProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  id: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: Option[];
  orientation?: Orientation;
  className?: string;
  disabled?: boolean;
}

export function FormCombobox<T extends FieldValues>({
  name,
  control,
  label,
  id,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  options,
  orientation = "responsive",
  className,
  disabled = false,
}: FormComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      name={name}
      control={control}
      label={label}
      id={id}
      orientation={orientation}
    >
      {(field) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                "w-full h-10 px-4 justify-between border-muted border-2 rounded-sm font-normal",
                !field.value && "text-muted-foreground",
                className
              )}
            >
              {field.value
                ? options.find((option) => option.value === field.value)?.label
                : placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label} // Use label for filtering
                      onSelect={() => {
                        field.onChange(option.value === field.value ? "" : option.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </FormField>
  );
}
