import { type Column } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export const ColumnHeader = <TData, TValue>({
  column,
  title,
  className,
}: ColumnHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) {
    return <div className={cn("font-medium", className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 data-[state=open]:bg-accent justify-start px-2 font-medium hover:bg-accent/50",
        className
      )}
      onClick={() => column.toggleSorting(sorted === "asc")}>
      <span>{title}</span>
      <div className="ml-2 h-4 w-4">
        {sorted === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : sorted === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
    </Button>
  );
};
