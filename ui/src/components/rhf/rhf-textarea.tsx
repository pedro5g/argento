import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { AlertCircle } from "lucide-react";

interface RHFTextareaProps<T extends FieldValues>
  extends React.ComponentProps<"textarea"> {
  name: Path<T>;
  label?: string;
  labelClassName?: string;
  iconLeft?: () => React.JSX.Element;
}

export const RHFTextarea = <T extends FieldValues>({
  name,
  label,
  labelClassName,
  iconLeft: IconLeft,
  className,
  ...props
}: RHFTextareaProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange, ref, name },
        fieldState: { invalid, error },
      }) => {
        return (
          <div
            data-error={invalid}
            className="w-full relative data-[error=false]:focus-within:[&>div>svg]:stroke-blue-500">
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
            <Textarea
              ref={ref}
              data-error={invalid}
              id={label}
              name={name}
              value={value}
              onChange={onChange}
              className={cn(
                "rounded-md border-2 selection:bg-blue-300 focus-visible:ring-0 focus:ring-0 focus-visible:border-blue-400 focus:border-blue-400 data-[error=true]:border-red-400  data-[error=true]:focus-visible:ring-red-400 w-full",
                IconLeft && "pl-10",
                className
              )}
              {...props}
            />
            {IconLeft && (
              <div
                data-error={invalid}
                className="absolute top-7 left-2 text-zinc-400 data-[error=true]:[&>svg]:stroke-red-500">
                <IconLeft />
              </div>
            )}

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
