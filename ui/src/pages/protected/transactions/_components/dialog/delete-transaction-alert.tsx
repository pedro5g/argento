import type { ApiError } from "@/api/api-types";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiDeleteTransaction } from "@/api/endpoints";
import { Button } from "@/components/ui/button";

interface DeleteTransactionAlertProps {
  transactionId: string;
  children: React.ReactNode;
}

export const DeleteTransactionAlert = ({
  transactionId,
  children,
}: DeleteTransactionAlertProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ transactionId }: { transactionId: string }) =>
      ApiDeleteTransaction({ transactionId }),
    onSuccess: async ({ message }) => {
      console.log(message);
      await queryClient.refetchQueries({
        queryKey: ["transactions"],
      });
      setOpen(false);
    },
    onError: (error: ApiError) => {
      console.error("Error on delete transaction >>>", error);
    },
  });

  const handleDelete = (id: string) => {
    if (isPending) return;
    mutate({ transactionId: id });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-zinc-800">
            <AlertCircle className="mx-auto size-8" />
            Are you sure you want to delete this transaction?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="text-center">
                This action will permanently remove the transaction and deduct
                its value from your balance. This change cannot be undone.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <div>
            <Button
              className="bg-red-100 hover:bg-red-50 text-red-500"
              disabled={isPending}
              onClick={() => handleDelete(transactionId)}>
              {isPending && <Loader2 className="animate-spin" />}
              Confirm
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
