import { Controller, ControllerRenderProps, FieldValues, Path, Control } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
} from "@/components/ui/field";

export type Orientation = "vertical" | "horizontal" | "responsive";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  id: string; // เพิ่ม
  orientation?: Orientation;
  hideLabel?: boolean;
  children: (field: ControllerRenderProps<T, Path<T>>, id: string) => React.ReactNode;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  id,
  orientation,
  hideLabel,
  children,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation={orientation} data-invalid={fieldState.invalid}>
          {orientation === "responsive" || orientation === "horizontal" ? (
            // Responsive or Horizontal layout
            <>
              <FieldContent>
                {!hideLabel && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              {children(field, id)}
            </>
          ) : (
            // Standard layout (label on top, content at the bottom)
            <>
              {!hideLabel && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
              {children(field, id)}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </>
          )}
        </Field>
      )}
    />
  );
}
