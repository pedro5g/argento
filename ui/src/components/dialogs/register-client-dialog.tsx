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
import { ApiRegisterClient, ApiUpdateClient } from "@/api/endpoints";
import type { ApiError, Client } from "@/api/api-types";

const formSchema = z.object({
  name: z.string().trim().min(3),
  email: z.string().trim().email().nullable(),
  phone: z.string().trim().nullable(),
});

type FormType = z.infer<typeof formSchema>;

interface RegisterClientDialogProps {
  children?: React.ReactNode;
  client?: Client;
}

export const RegisterClientDialog = ({
  children,
  client,
}: RegisterClientDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = client
    ? {
        name: client.name,
        email: client.email,
        phone: client.phone,
      }
    : {
        name: "",
        email: null,
        phone: null,
      };

  const forms = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: FormType) => {
      if (client) {
        return ApiUpdateClient({ id: client.id, ...body });
      }
      return ApiRegisterClient(body);
    },
    onSuccess: async ({ message }) => {
      console.log(message);
      await queryClient.refetchQueries({
        queryKey: ["clients"],
      });
      setOpen(false);
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
        <DialogTitle>{client ? "Update" : "Register"} client</DialogTitle>
        <DialogDescription>
          {client ? "Update" : "Register"} clients that you frequently do
          payments
        </DialogDescription>
        <Separator />
        <RHFForm methods={forms}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              forms.handleSubmit(onSubmit)(e);
            }}
            className="space-y-6">
            <RHFInput<FormType>
              label="Client name"
              name="name"
              iconLeft={() => <User className="size-5" />}
            />
            <RHFInput<FormType>
              label="Email"
              name="email"
              iconLeft={() => <Mail className="size-5" />}
              placeholder="@email.com..."
            />
            <RHFInput<FormType>
              label="Phone"
              name="phone"
              mask="phone"
              iconLeft={() => <Smartphone className="size-5" />}
              placeholder="(15) 9999-9999"
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
                <Button variant="blue">{client ? "Update" : "Register"}</Button>
              </div>
            </div>
          </form>
        </RHFForm>
      </DialogContent>
    </Dialog>
  );
};
