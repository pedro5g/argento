import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { PlusSquare, Bookmark } from "lucide-react";
import { Button } from "../ui/button";
import { RHFEmojiPicker } from "../rhf/rhf-emoji-picker";
import { RHFForm } from "../rhf/rhf-form";
import { RHFInput } from "../rhf/rhf-input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ApiCreatePaymentMethod,
  ApiUpdatePaymentMethod,
} from "@/api/endpoints";
import type { ApiError, PaymentMethod } from "@/api/api-types";

const formSchema = z.object({
  name: z.string().trim().min(3),
  emoji: z.string().emoji(),
});

type FormType = z.infer<typeof formSchema>;

interface CreatePaymentMethodDialogProps {
  children?: React.ReactNode;
  paymentMethod?: PaymentMethod;
}

export const CreatePaymentMethodDialog = ({
  children,
  paymentMethod,
}: CreatePaymentMethodDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = paymentMethod
    ? { name: paymentMethod.name, emoji: paymentMethod.emoji }
    : {
        name: "",
        emoji: "💵",
      };

  const forms = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: FormType) => {
      if (paymentMethod) {
        return ApiUpdatePaymentMethod({ id: paymentMethod.id, ...body });
      }
      return ApiCreatePaymentMethod(body);
    },
    onSuccess: async ({ message }) => {
      console.log(message);
      await queryClient.refetchQueries({
        queryKey: ["payment-methods"],
      });
      setOpen(false);
    },
    onError: (error: ApiError) => {
      console.error(error);
    },
  });

  const onSubmit = ({ name, emoji }: FormType) => {
    if (isPending) return;
    mutate({ name, emoji });
  };

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant={"ghost"}
            className="flex border-separate items-center justify-start rounded-none 
          border-b px-3 py-3 text-muted-foreground">
            <PlusSquare className="mr-2 h-4 w-4" />
            Create new
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          {paymentMethod ? "Update" : "Add new"} payment method
        </DialogTitle>
        <DialogDescription>
          To better organize your expenses, say how they were paid
        </DialogDescription>
        <Separator />
        <RHFForm methods={forms}>
          <form onSubmit={forms.handleSubmit(onSubmit)} className="space-y-6">
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <RHFEmojiPicker<FormType> name="emoji" />
              <p className="text-zinc-400 text-xs mr-auto">
                Style your payment with emojis
              </p>
            </div>
            <div>
              <RHFInput<FormType>
                label="Payment name"
                name="name"
                iconLeft={() => <Bookmark />}
              />
            </div>
            <div className="w-full inline-flex items-center justify-end gap-4">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                  }}>
                  Cancel
                </Button>
              </div>
              <div>
                <Button variant="blue">
                  {paymentMethod ? "Update" : "Register"}
                </Button>
              </div>
            </div>
          </form>
        </RHFForm>
      </DialogContent>
    </Dialog>
  );
};
