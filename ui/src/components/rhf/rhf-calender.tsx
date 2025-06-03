import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Label } from "../ui/label";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import type { Matcher } from "react-day-picker";

interface RHFCalenderProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  labelClassName?: string;
  disabled?: (data: Matcher | Matcher[]) => boolean;
}

export const RHFCalender = <T extends FieldValues>({
  name,
  label,
  labelClassName,
  disabled,
}: RHFCalenderProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange },
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
            <Popover modal>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                  )}>
                  <CalendarIcon />
                  {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={(value) => {
                    onChange(value);
                  }}
                  disabled={disabled}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

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
