// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
  XCircle,
  Calendar,
  FileText,
  Ellipsis,
} from "lucide-react";

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

  const handleDelete = () => {
    // Implementar exclusão da transação
    console.log("Excluir transação:", transaction.id);
    // toast({
    //   title: "Excluir transação",
    //   description: `Excluindo transação: ${transaction.title}`,
    //   variant: "destructive",
    // });
  };

  const handleCopy = () => {
    // Copiar ID da transação
    navigator.clipboard.writeText(transaction.id);
    // toast({
    //   title: "ID copiado",
    //   description: "ID da transação copiado para a área de transferência",
    // });
  };

  const handleToggleConfirmed = () => {
    // Implementar alternar status de confirmação
    const newStatus = transaction.confirmed === 1 ? "pendente" : "confirmada";
    console.log(`Marcar transação como ${newStatus}:`, transaction.id);
    // toast({
    //   title: "Status alterado",
    //   description: `Transação marcada como ${newStatus}`,
    // });
  };

  const handleSchedule = () => {
    // Implementar agendamento da transação
    console.log("Agendar transação:", transaction.id);
    // toast({
    //   title: "Agendar transação",
    //   description: `Agendando transação: ${transaction.title}`,
    // });
  };

  const handleDuplicate = () => {
    // Implementar duplicação da transação
    console.log("Duplicar transação:", transaction.id);
    // toast({
    //   title: "Duplicar transação",
    //   description: `Duplicando transação: ${transaction.title}`,
    // });
  };

  const isConfirmed = transaction.confirmed === 1;
  const isScheduled = transaction.is_scheduled === 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          Visualizar
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicar
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleToggleConfirmed}>
          {isConfirmed ? (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Marcar como pendente
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Marcar como confirmada
            </>
          )}
        </DropdownMenuItem>

        {!isScheduled && (
          <DropdownMenuItem onClick={handleSchedule}>
            <Calendar className="mr-2 h-4 w-4" />
            Agendar
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopy}>
          <FileText className="mr-2 h-4 w-4" />
          Copiar ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
