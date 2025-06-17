import React, { useState } from "react";

import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  Tag,
} from "lucide-react";
import type { Transaction } from "@/api/api-types";
import { Label } from "../ui/label";

const editTransactionSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((val) => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Valor deve ser um número positivo válido"),
});

type EditTransactionForm = z.infer<typeof editTransactionSchema>;

interface TransactionEditModalProps {
  transaction: Transaction;
}

export const TransactionEditModal = ({
  transaction,
}: TransactionEditModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: transaction.title,
        description: transaction.description,
        amount: transaction.amount,
      });
      setErrors({});
    }
  }, [isOpen, transaction]);

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(",", "."));
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const validateForm = (data: EditTransactionForm) => {
    try {
      editTransactionSchema.parse(data);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        return newErrors;
      }
      return {};
    }
  };

  const handleInputChange = (
    field: keyof EditTransactionForm,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para enviar à API no formato esperado
      const apiData = {
        title: formData.title,
        description: formData.description || null,
        amount: parseFloat(formData.amount.replace(",", ".")),
        type: transaction.type,
        date: transaction.date,
        is_scheduled: transaction.is_scheduled === 1,
        scheduled_date: transaction.scheduled_date,
        confirmed: transaction.confirmed,
        recurrence: transaction.recurrence,
        category_id: transaction.category_id,
        client_id: transaction.client_id,
        payment_method_id: transaction.payment_method_id,
        account_id: transaction.account_id,
      };

      console.log("Dados enviados para API:", apiData);

      // Aqui você faria a chamada real para sua API
      // const response = await fetch(`/api/transactions/${transaction.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(apiData)
      // });

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsOpen(false);
      setFormData({ title: "", description: "", amount: "" });
      setErrors({});

      // Aqui você poderia atualizar a lista de transações
      console.log("Transação atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      setErrors({ general: "Erro ao salvar a transação. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Editar Transação
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Transação
          </DialogTitle>
          <DialogDescription>
            Edite os detalhes da transação. Campos editáveis: título, descrição
            e valor.
          </DialogDescription>
        </DialogHeader>

        {/* Informações da transação (somente leitura) */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-sm text-gray-700">
            Informações da Transação
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Categoria:</span>
              <Badge variant="secondary">
                {transaction.category_emoji} {transaction.category_name}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Data:</span>
              <span className="font-medium">
                {new Date(transaction.date).toLocaleDateString("pt-BR")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Conta:</span>
              <span className="font-medium">{transaction.account_name}</span>
            </div>

            {transaction.payment_method_name && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Pagamento:</span>
                <Badge variant="outline">
                  {transaction.payment_method_emoji}{" "}
                  {transaction.payment_method_name}
                </Badge>
              </div>
            )}

            {transaction.client_name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium">{transaction.client_name}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Tipo:</span>
              <Badge
                variant={
                  transaction.type === "expense" ? "destructive" : "default"
                }>
                {transaction.type === "expense" ? "Despesa" : "Receita"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Formulário de edição */}
        <div className="space-y-4">
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Digite o título da transação"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Digite uma descrição (opcional)"
              className={`resize-none ${
                errors.description ? "border-red-500" : ""
              }`}
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                placeholder="0,00"
                className={`pl-10 ${errors.amount ? "border-red-500" : ""}`}
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}
            {formData.amount && !errors.amount && (
              <p className="text-sm text-gray-600">
                Valor formatado: {formatCurrency(formData.amount)}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
