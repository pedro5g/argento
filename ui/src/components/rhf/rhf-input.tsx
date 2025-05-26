import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeClosed } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useState } from "react";

interface RHFInputProps<T extends FieldValues>
  extends React.ComponentProps<"input"> {
  name: Path<T>;
  label?: string;
  labelClassName?: string;
  iconLeft?: () => React.JSX.Element;
}

export const RHFInput = <T extends FieldValues>({
  label,
  name,
  labelClassName,
  className,
  type = "text",
  iconLeft: IconLeft,
  ...props
}: RHFInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, ref },
        fieldState: { invalid, error },
      }) => {
        return (
          <div className="w-full relative">
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
            <Input
              ref={ref}
              data-error={invalid}
              id={label}
              type={
                type === "password"
                  ? showPassword
                    ? "password"
                    : "text"
                  : type
              }
              onChange={onChange}
              value={value}
              className={cn(
                "py-5 rounded-md border-2 selection:bg-blue-300 focus-visible:ring-0 focus:ring-0 focus-visible:border-blue-400 focus:border-blue-400 data-[error=true]:border-red-400 data-[error=true]:focus-visible:ring-red-400 w-full",
                IconLeft && "pl-10",
                className
              )}
              {...props}
            />
            {IconLeft && (
              <div className="absolute top-7 left-2 text-zinc-400">
                <IconLeft />
              </div>
            )}
            {type === "password" && (
              <button
                type="button"
                className="absolute top-7 right-2 z-10 text-zinc-400"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye size={22} /> : <EyeClosed size={22} />}
              </button>
            )}
            {invalid && error?.message && (
              <span className="inline-flex items-center gap-2 text-xs font-light text-red-500 bg-red-100 rounded-md px-2 py-0.5 mt-1">
                <AlertCircle className="size-4" /> {error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};
