import {
  Controller,
  FieldValues,
  Path,
  Control,
  FieldError as RHFFieldError,
} from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
} from "@/components/ui/field";

type Orientation = "vertical" | "responsive";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  id: string; // เพิ่ม
  orientation?: Orientation;
  children: (field: any, id: string) => React.ReactNode; // ส่ง id ออกไปด้วย
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  id,
  orientation,
  children,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation={orientation} data-invalid={fieldState.invalid}>
          {orientation === "responsive" ? (
            // Responsive layout (label on the left, content on the right)
            <>
              <FieldContent>
                <FieldLabel htmlFor={id}>{label}</FieldLabel> {/* link label */}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              {children(field, id)}
            </>
          ) : (
            // Standard layout (label on top, content at the bottom)
            <>
              <FieldLabel htmlFor={id}>{label}</FieldLabel> {/* link label */}
              {children(field, id)}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </>
          )}
        </Field>
      )}
    />
  );
}
