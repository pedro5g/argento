import type { Transaction } from "@/api/api-types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, CheckCircle, FileText, Ellipsis } from "lucide-react";
import { DeleteTransactionAlert } from "../dialog/delete-transaction-alert";
import { ConfirmTransactionScheduledAlert } from "../dialog/confirm-transaction-scheduled-alert";

interface RowActionsProps {
  transaction: Transaction;
}

export const RowActions = ({ transaction }: RowActionsProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(transaction.id);
  };

  const isConfirmed = transaction.confirmed === 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {!isConfirmed && (
          <ConfirmTransactionScheduledAlert transactionId={transaction.id}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Make as confirmed
            </DropdownMenuItem>
          </ConfirmTransactionScheduledAlert>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopy}>
          <FileText className="mr-2 h-4 w-4" />
          Copy ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DeleteTransactionAlert transactionId={transaction.id}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-red-600 focus:text-red-600 cursor-pointer">
            <Trash2 className="mr-2 h-4 w-4 stroke-red-600" />
            Delete
          </DropdownMenuItem>
        </DeleteTransactionAlert>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
