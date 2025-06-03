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
import { useGetClients } from "@/api/hooks/use-get-clients";
import type { Client } from "@/api/api-types";
import { RegisterClientDialog } from "../dialogs/register-client-dialog";

interface RHFClientSelectorProps<T extends FieldValues> {
  name: Path<T>;
  className?: string;
}

export const RHFClientSelector = <T extends FieldValues>({
  name,
  className,
}: RHFClientSelectorProps<T>) => {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();

  const { clients, isPending } = useGetClients();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const selectedClient = clients
          ? clients.find((c) => c.id === value)
          : undefined;

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                className={cn("w-full ", className)}
                variant="outline"
                role="combobox">
                {selectedClient ? (
                  <ClientRow client={selectedClient} />
                ) : (
                  "Select client"
                )}
                <ChevronsUpDown className=" ml-auto size-4 shrink-0 opacity-80" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
              <Command onSubmit={(e) => e.preventDefault()}>
                <CommandInput placeholder="Search category..." />
                <RegisterClientDialog />
                <CommandEmpty>
                  <strong>Client not found</strong>
                  <p className=" text-sm text-muted-foreground">
                    Tip: Create a new client
                  </p>
                </CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {isPending || !clients
                      ? "Loading..."
                      : clients.map((client) => (
                          <CommandItem
                            key={client.id}
                            onSelect={(value) => {
                              onChange(value);
                              setOpen(false);
                            }}
                            value={client.id}>
                            <ClientRow client={client} />
                            <Check
                              className={cn(
                                "ml-2 size-4 opacity-0",
                                value === client.id && "opacity-100"
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

interface ClientRowProps {
  client: Client;
}

const ClientRow = ({ client }: ClientRowProps) => {
  return (
    <div className="flex items-center gap-2">
      <span>{client.name}</span>
    </div>
  );
};
