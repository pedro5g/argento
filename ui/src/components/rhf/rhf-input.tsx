import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeClosed } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useCallback, useState } from "react";

interface RHFInputProps<T extends FieldValues>
  extends React.ComponentProps<"input"> {
  name: Path<T>;
  label?: string;
  labelClassName?: string;
  showIssue?: boolean;
  mask?: "currency";
  iconLeft?: () => React.JSX.Element;
}

export const RHFInput = <T extends FieldValues>({
  label,
  name,
  labelClassName,
  className,
  type = "text",
  iconLeft: IconLeft,
  showIssue = true,
  mask,
  ...props
}: RHFInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const { control } = useFormContext();

  const cleanFormat = (value: string) => {
    return value.replace(/\D/g, "").trim();
  };

  const applyMask = useCallback((value: string, maskType?: string) => {
    if (!value) return "";
    switch (maskType) {
      case "currency":
        return formatCurrency(value);
      default:
        return value;
    }
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, ref },
        fieldState: { invalid, error },
      }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          const formattedValue = mask
            ? applyMask(inputValue, mask)
            : inputValue;

          if (mask) {
            onChange(cleanFormat(formattedValue));
          } else {
            onChange(inputValue);
          }
        };

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
            <Input
              ref={ref}
              data-error={invalid}
              id={label}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              onChange={handleChange}
              value={mask && value ? applyMask(value, mask) : value || ""}
              className={cn(
                "py-5 rounded-md border-2 selection:bg-blue-300 focus-visible:ring-0 focus:ring-0 focus-visible:border-blue-400 focus:border-blue-400 data-[error=true]:border-red-400  data-[error=true]:focus-visible:ring-red-400 w-full",
                IconLeft && "pl-10",
                type === "password" && "pr-10",
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
            {type === "password" && (
              <button
                type="button"
                className="absolute top-8 right-3 z-10 text-zinc-400"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                <span className="sr-only">
                  {showPassword ? "hidden password" : "show password"}
                </span>
              </button>
            )}
            {showIssue && invalid && error?.message && (
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
