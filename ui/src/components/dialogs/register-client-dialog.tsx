import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { PlusSquare, User, Mail, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import { RHFForm } from "../rhf/rhf-form";
import { RHFInput } from "../rhf/rhf-input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRegisterClient } from "@/api/endpoints";
import type { ApiError } from "@/api/api-types";

const formSchema = z.object({
  name: z.string().trim().min(3),
  email: z.string().trim().email().nullable(),
  phone: z.string().trim().nullable(),
});

type FormType = z.infer<typeof formSchema>;

export const RegisterClientDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const forms = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: null,
      phone: null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: FormType) => ApiRegisterClient(body),
    onSuccess: async ({ message }) => {
      console.log(message);
      await queryClient.refetchQueries({
        queryKey: ["clients"],
      });
    },
    onError: (error: ApiError) => {
      console.error(error);
    },
  });

  const onSubmit = ({ name, email, phone }: FormType) => {
    if (isPending) return;
    mutate({ name, email, phone });
  };

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex border-separate items-center justify-start rounded-none 
          border-b px-3 py-3 text-muted-foreground">
          <PlusSquare className="mr-2 h-4 w-4" />
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Register client</DialogTitle>
        <DialogDescription>
          Register clients that you frequently do payments
        </DialogDescription>
        <Separator />
        <RHFForm methods={forms}>
          <form onSubmit={forms.handleSubmit(onSubmit)} className="space-y-6">
            <RHFInput<FormType>
              label="Client name"
              name="name"
              iconLeft={() => <User className="size-5" />}
            />
            <RHFInput<FormType>
              label="Email"
              name="email"
              iconLeft={() => <Mail className="size-5" />}
            />
            <RHFInput<FormType>
              label="Phone"
              name="phone"
              iconLeft={() => <Smartphone className="size-5" />}
            />
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
                <Button variant="blue">Cadastrar</Button>
              </div>
            </div>
          </form>
        </RHFForm>
      </DialogContent>
    </Dialog>
  );
};
