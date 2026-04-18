import { FieldValues, Path, Control } from "react-hook-form";
import { FormField } from "./form-field";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  id: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  orientation?: "vertical" | "responsive";
}

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  label,
  id,
  placeholder,
  rows = 4,
  className,
  orientation = "vertical",
}: FormTextareaProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      label={label}
      id={id}
      orientation={orientation}
    >
      {(field, id) => (
        <Textarea
          id={id}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            "border-muted border-2 rounded-sm text-sm placeholder:text-sm",
            className,
          )}
          {...field}
        />
      )}
    </FormField>
  );
}
