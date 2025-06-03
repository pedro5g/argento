import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { CategoryTypes } from "@/api/api-types";
import { useGetCategories } from "@/api/hooks/use-get-categories";
import { CreateCategoryDialog } from "../dialogs/create-category-dialog";

interface RHFCategorySelectorProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  className?: string;
  categoryType: CategoryTypes;
}

export const RHFCategorySelector = <T extends FieldValues>({
  name,
  className,
  categoryType,
}: RHFCategorySelectorProps<T>) => {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();
  const { categories, isPending } = useGetCategories(categoryType);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const selectedCategory = categories
          ? categories.find((c) => c.id.toString() === value)
          : undefined;

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                className={cn("w-full ", className)}
                variant="outline"
                role="combobox">
                {selectedCategory ? (
                  <CategoryRow
                    name={selectedCategory.name}
                    emoji={selectedCategory.emoji}
                  />
                ) : (
                  "Select category"
                )}
                <ChevronsUpDown className=" ml-auto size-4 shrink-0 opacity-80" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
              <Command onSubmit={(e) => e.preventDefault()}>
                <CommandInput placeholder="Search category..." />
                <CreateCategoryDialog type={categoryType} />
                <CommandEmpty>
                  <strong>Category not found</strong>
                  <p className=" text-sm text-muted-foreground">
                    Tip: Create a new category
                  </p>
                </CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {isPending || !categories
                      ? "Loading..."
                      : categories.map((category, i) => (
                          <CommandItem
                            key={category.name + i}
                            onSelect={(value) => {
                              onChange(value);
                              setOpen(false);
                            }}
                            value={category.id.toString() || ""}>
                            <CategoryRow
                              name={category.name}
                              emoji={category.emoji}
                            />
                            <Check
                              className={cn(
                                "ml-2 size-4 opacity-0",
                                value === category.id.toString() &&
                                  "opacity-100"
                              )}
                            />
                          </CommandItem>
                        ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};

interface CategoryProps {
  name: string;
  emoji: string;
}

const CategoryRow = ({ name, emoji }: CategoryProps) => {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{emoji}</span>
      <span>{name}</span>
    </div>
  );
};
