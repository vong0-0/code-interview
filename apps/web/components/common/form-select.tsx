import { FieldValues, Path, Control } from "react-hook-form";
import { FormField } from "./form-field";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  id: string;
  placeholder?: string;
  children: React.ReactNode;
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  id,
  placeholder,
  children,
}: FormSelectProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      label={label}
      id={id}
      orientation="responsive"
    >
      {(field, id) => (
        <Select
          name={field.name}
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger id={id}>
            {" "}
            {/* link trigger */}
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormField>
  );
}
