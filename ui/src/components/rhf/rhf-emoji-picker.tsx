import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";

export type Option = {
  title: string | React.JSX.Element;
  value: string;
};

interface RHFEmojiPicker<T extends FieldValues> {
  name: Path<T>;
}

export const RHFEmojiPicker = <T extends FieldValues>({
  name,
}: RHFEmojiPicker<T>) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        fieldState: { invalid, error },
        field: { onChange, value },
      }) => {
        return (
          <div data-error={invalid}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="font-normal size-[60px] !p-2 !shadow-none mt-2 
                    items-center rounded-full">
                  <span className="text-4xl">{value}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="!p-0">
                <Picker
                  data={data}
                  categories={[
                    "activity",
                    "flags",
                    "foods",
                    "frequent",
                    "objects",
                    "people",
                    "places",
                    "symbols",
                  ]}
                  onEmojiSelect={(emoji: { native: string }) =>
                    onChange(emoji.native)
                  }
                  emojiSize={20}
                  showPreview={false}
                  showSkinTones={false}
                  theme="light"
                  navPosition="top"
                  maxFrequentRows={0}
                  emojiButtonColors={["rgba(102, 51, 153, .2)"]}
                  className="h-[40px]"
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
