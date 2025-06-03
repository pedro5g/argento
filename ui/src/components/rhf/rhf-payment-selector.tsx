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
import { useListPaymentMethods } from "@/api/hooks/use-list-payment-methods";
import { CreatePaymentMethodDialog } from "../dialogs/create-payment-method-dialog";

interface RHFPaymentSelectorProps<T extends FieldValues> {
  name: Path<T>;
  className?: string;
}

export const RHFPaymentSelector = <T extends FieldValues>({
  name,
  className,
}: RHFPaymentSelectorProps<T>) => {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();

  const { paymentMethods, isPending } = useListPaymentMethods();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const selectedPayment = paymentMethods
          ? paymentMethods.find((c) => c.id.toString() === value)
          : undefined;

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                className={cn("w-full ", className)}
                variant="outline"
                role="combobox">
                {selectedPayment ? (
                  <PaymentRow
                    name={selectedPayment.name}
                    emoji={selectedPayment.emoji}
                  />
                ) : (
                  "Select payment method"
                )}
                <ChevronsUpDown className=" ml-auto size-4 shrink-0 opacity-80" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
              <Command onSubmit={(e) => e.preventDefault()}>
                <CommandInput placeholder="Search category..." />
                <CreatePaymentMethodDialog />
                <CommandEmpty>
                  <strong>Payment method not found</strong>
                  <p className=" text-sm text-muted-foreground">
                    Tip: Create payment method
                  </p>
                </CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {isPending || !paymentMethods
                      ? "Loading..."
                      : paymentMethods.map((payment, i) => (
                          <CommandItem
                            key={payment.name + i}
                            onSelect={(value) => {
                              onChange(value);
                              setOpen(false);
                            }}
                            value={payment.id.toString() || ""}>
                            <PaymentRow
                              name={payment.name}
                              emoji={payment.emoji}
                            />
                            <Check
                              className={cn(
                                "ml-2 size-4 opacity-0",
                                value === payment.id.toString() && "opacity-100"
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

interface PaymentRowProps {
  name: string;
  emoji: string;
}

const PaymentRow = ({ name, emoji }: PaymentRowProps) => {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{emoji}</span>
      <span>{name}</span>
    </div>
  );
};
