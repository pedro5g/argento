import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface RHFSwitchProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
}

export const RHFSwitch = <T extends FieldValues>({
  name,
  label,
  labelClassName,
  disabled,
}: RHFSwitchProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { name, onChange, value },
        fieldState: { invalid, error },
      }) => {
        return (
          <div
            data-error={invalid}
            className=" relative data-[error=false]:focus-within:[&>div>svg]:stroke-blue-500">
            {label && (
              <Label
                data-error={invalid}
                htmlFor={label}
                className={cn(
                  "data-[error=true]:text-red-400 font-semibold mb-1",
                  labelClassName
                )}>
                {label}
              </Label>
            )}
            <Switch
              name={name}
              disabled={disabled}
              id={label}
              checked={value}
              onCheckedChange={(checked) => onChange(checked)}
            />

            {invalid && error?.message && (
              <span
                aria-live="polite"
                aria-atomic="true"
                aria-describedby="helper message"
                className="inline-flex items-center gap-1 text-sm text-red-500 font-normal rounded-md px-2 py-0.5 mt-1">
                <AlertCircle size={19} /> {error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};
