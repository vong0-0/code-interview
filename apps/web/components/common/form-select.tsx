import { FieldValues, Path, Control } from "react-hook-form";
import { FormField, Orientation } from "./form-field";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  id: string;
  placeholder?: string;
  children: React.ReactNode;
  orientation?: Orientation;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  id,
  placeholder,
  children,
  orientation = "responsive",
  className,
}: FormSelectProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      label={label}
      id={id}
      orientation={orientation}
    >
      {(field, id) => (
        <Select
          name={field.name}
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger
            id={id}
            className={cn("w-full border-muted border-2 rounded-sm", className)}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormField>
  );
}
