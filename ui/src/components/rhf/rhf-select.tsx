import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export type Option = {
  title: string | React.JSX.Element;
  value: string;
};

interface RHFSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  labelClassName?: string;
  options: Option[];
  iconLeft?: () => React.JSX.Element;
  placeholder?: string;
  className?: string;
}

export const RHFSelect = <T extends FieldValues>({
  name,
  label,
  labelClassName,
  options,
  iconLeft: IconLeft,
  placeholder,
  className,
}: RHFSelectProps<T>) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        fieldState: { invalid, error },
        field: { name, onChange, value },
      }) => {
        return (
          <div data-error={invalid} className="w-full relative ">
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
            <Select
              name={name}
              value={value}
              onValueChange={(value) => onChange(value)}>
              <SelectTrigger
                className={cn(
                  "py-5 rounded-md border-2 selection:bg-blue-300 data-[state=open]:border-blue-400  data-[error=true]:border-red-400  data-[error=true]:focus-visible:ring-red-400 w-full",
                  IconLeft && "pl-9",
                  className
                )}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {options.map(({ value, title }) => (
                    <SelectItem value={value}>{title}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {IconLeft && (
              <div
                data-error={invalid}
                className="absolute top-8 left-2 text-zinc-400 data-[error=true]:[&>svg]:stroke-red-500">
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
