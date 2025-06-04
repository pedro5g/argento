import type { ApiError, PaymentMethod } from "@/api/api-types";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "../ui/alert-dialog";
import { useState } from "react";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiDeletePaymentMethod } from "@/api/endpoints";
import { Button } from "../ui/button";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

interface DeletePaymentMethodsAlertProps {
  paymentMethods: PaymentMethod;
  children: React.ReactNode;
}

export const DeletePaymentMethodAlert = ({
  paymentMethods,
  children,
}: DeletePaymentMethodsAlertProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: number }) => ApiDeletePaymentMethod({ id }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["payment-methods"],
      });
      setOpen(false);
    },
    onError: (error: ApiError) => {
      console.error(error);
      if (
        error.response.data.error ===
        "Payment method cannot be deleted because it is associated with transactions."
      ) {
        setError(error.response.data.error);
      }
    },
  });

  const handleDelete = () => {
    if (isPending) return;
    mutate({ id: paymentMethods.id });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="inline-flex gap-2 items-center">
            Are you sure ?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>
                After confirmation, this payment method will be permanently
                deleted .
              </p>
            </div>
          </AlertDialogDescription>
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Unable to process.</AlertTitle>
              <AlertDescription className="text-xs">
                <p>{error}</p>
              </AlertDescription>
            </Alert>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <div>
            <Button variant="blue" disabled={isPending} onClick={handleDelete}>
              {isPending && <Loader2 className="animate-spin" />}
              Confirm
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
