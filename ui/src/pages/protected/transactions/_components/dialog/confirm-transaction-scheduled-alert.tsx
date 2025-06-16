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
import { ApiConfirmScheduledTransaction } from "@/api/endpoints";
import { Button } from "@/components/ui/button";

interface ConfirmTransactionScheduledAlertProps {
  transactionId: string;
  children: React.ReactNode;
}

export const ConfirmTransactionScheduledAlert = ({
  transactionId,
  children,
}: ConfirmTransactionScheduledAlertProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ transactionId }: { transactionId: string }) =>
      ApiConfirmScheduledTransaction({ transactionId }),
    onSuccess: async ({ message }) => {
      console.log(message);
      await queryClient.refetchQueries({
        queryKey: ["transactions"],
      });
      setOpen(false);
    },
    onError: (error: ApiError) => {
      console.error("Error on confirm transaction >>>", error);
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
            Confirm scheduled transaction?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="text-center">
                By confirming, the scheduled transaction amounts will be applied
                to your balance. This action is permanent and cannot be undone.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <div>
            <Button
              className="bg-blue-100 hover:bg-blue-50 text-blue-500"
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
