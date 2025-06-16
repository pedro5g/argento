import type { Transaction } from "@/api/api-types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  Eye,
  Copy,
  CheckCircle,
  FileText,
  Ellipsis,
} from "lucide-react";
import { DeleteTransactionAlert } from "../dialog/delete-transaction-alert";
import { ConfirmTransactionScheduledAlert } from "../dialog/confirm-transaction-scheduled-alert";

interface RowActionsProps {
  transaction: Transaction;
}

export const RowActions = ({ transaction }: RowActionsProps) => {
  const handleView = () => {
    // Implementar visualização da transação
    console.log("Visualizar transação:", transaction.id);
    // toast({
    //   title: "Visualizar transação",
    //   description: `Abrindo detalhes da transação: ${transaction.title}`,
    // });
  };

  const handleEdit = () => {
    // Implementar edição da transação
    console.log("Editar transação:", transaction.id);
    // toast({
    //   title: "Editar transação",
    //   description: `Editando transação: ${transaction.title}`,
    // });
  };

  // const handleDelete = () => {
  //   // Implementar exclusão da transação
  //   console.log("Excluir transação:", transaction.id);
  //   // toast({
  //   //   title: "Excluir transação",
  //   //   description: `Excluindo transação: ${transaction.title}`,
  //   //   variant: "destructive",
  //   // });
  // };

  const handleCopy = () => {
    // Copiar ID da transação
    navigator.clipboard.writeText(transaction.id);
    // toast({
    //   title: "ID copiado",
    //   description: "ID da transação copiado para a área de transferência",
    // });
  };

  const handleDuplicate = () => {
    // Implementar duplicação da transação
    console.log("Duplicar transação:", transaction.id);
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
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuSeparator />

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
