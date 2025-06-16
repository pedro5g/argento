import { type ColumnDef } from "@tanstack/react-table";
import type { Transaction } from "@/api/api-types";
import { cn } from "@/lib/utils";
import { RowActions } from "./row-actions";
import { ColumnHeader } from "./column-header";
import { Count } from "@/components/count";
export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "title",
    header: () => <span>Title</span>,
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "description",
    header: () => <span>Description</span>,
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.description || "-"}
      </div>
    ),
  },
  {
    accessorKey: "category_name",
    header: () => <span>Category</span>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({
      row: {
        original: { category_name, category_emoji },
      },
    }) => (
      <div className="flex gap-2 capitalize">
        <div className="capitalize inline-flex items-center gap-1">
          <span>{category_emoji}</span>
          <span>{category_name}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => <ColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("pt-BR");
      return <div className="text-muted-foreground">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "type",
    header: () => <span>Type</span>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "capitalize rounded-full text-center p-1 text-xs font-medium",
          row.original.type === "income"
            ? "text-emerald-500 bg-emerald-500/10"
            : "text-red-500 bg-red-500/10"
        )}>
        {row.original.type}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <ColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      return (
        <p
          className={cn(
            "text-sm text-center rounded-full p-1 font-medium",
            row.original.type === "income"
              ? "text-emerald-600 bg-emerald-50"
              : "text-red-600 bg-red-50"
          )}>
          <Count amount={row.original.amount} />
        </p>
      );
    },
  },
  {
    accessorKey: "account_name",
    header: () => <span>Account</span>,
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.account_name}
      </div>
    ),
  },
  {
    accessorKey: "payment_method_name",
    header: () => <span>Payment</span>,
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.payment_method_name || "-"}
      </div>
    ),
  },
  {
    accessorKey: "confirmed",
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const isConfirmed = row.original.confirmed === 1;
      const isScheduled = row.original.is_scheduled === 1;

      let status = "Pending";
      let className = "text-yellow-600 bg-yellow-50";

      if (isConfirmed) {
        status = "Confirmed";
        className = "text-green-600 bg-green-50";
      } else if (isScheduled) {
        status = "Scheduled";
        className = "text-blue-600 bg-blue-50";
      }

      return (
        <div
          className={cn(
            "text-xs rounded-full px-2 py-1 font-medium",
            className
          )}>
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <RowActions transaction={row.original} />,
  },
];
