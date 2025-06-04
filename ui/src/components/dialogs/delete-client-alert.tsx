import type { ApiError, Client } from "@/api/api-types";
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
import { ApiDeleteClient } from "@/api/endpoints";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

interface DeleteClientAlertProps {
  client: Client;
  children: React.ReactNode;
}

export const DeleteClientAlert = ({
  client,
  children,
}: DeleteClientAlertProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => ApiDeleteClient({ id }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["clients"],
      });
      setOpen(false);
    },
    onError: (error: ApiError) => {
      if (
        error.response.data.error ===
        "Client cannot be deleted because it is associated with transactions."
      ) {
        setError(error.response.data.error);
      }
    },
  });

  const handleClose = (open: boolean) => {
    setOpen(() => {
      setError("");
      return open;
    });
  };

  const handleDelete = () => {
    if (isPending) return;
    mutate({ id: client.id });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="inline-flex gap-2 items-center">
            Are you sure ?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>Upon confirmation, this client will be permanently deleted</p>
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
