import type { ApiError, Category } from "@/api/api-types";
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
import { ApiDeleteCategory } from "@/api/endpoints";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

interface DeleteCategoryAlertProps {
  category: Category;
  children: React.ReactNode;
}

export const DeleteCategoryAlert = ({
  category,
  children,
}: DeleteCategoryAlertProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: number }) => ApiDeleteCategory({ id }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["categories"],
      });
      setOpen(false);
    },
    onError: (error: ApiError) => {
      if (
        error.response.data.error ===
        "Category cannot be deleted because it is associated with transactions."
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
    mutate({ id: category.id });
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
              <p>
                Upon confirmation, this category will be permanently deleted
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
