import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ColumnToggleProps<TData> {
  table: Table<TData>;
}

export function ColumnToggle<TData>({ table }: ColumnToggleProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <Settings2 className="mr-2 h-4 w-4" />
          Colunas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            const columnId = column.id;
            const columnName = getColumnDisplayName(columnId);

            return (
              <DropdownMenuCheckboxItem
                key={columnId}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                {columnName}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper function to get user-friendly column names
function getColumnDisplayName(columnId: string): string {
  const columnNames: Record<string, string> = {
    category_name: "Categoria",
    title: "Título",
    description: "Descrição",
    date: "Data",
    type: "Tipo",
    amount: "Valor",
    account_name: "Conta",
    payment_method_name: "Pagamento",
    confirmed: "Status",
    client_name: "Cliente",
    recurrence: "Recorrência",
    created_at: "Criado em",
    is_scheduled: "Agendado",
  };

  return columnNames[columnId] || columnId;
}
