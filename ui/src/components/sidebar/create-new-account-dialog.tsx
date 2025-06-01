import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";
import { useOpenAddNewAccountDialog } from "@/hooks/nuqs/use-open-add-new-account-dialog";
import { Separator } from "../ui/separator";
import { RHFForm } from "../rhf/rhf-form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInput } from "../rhf/rhf-input";
import { Button } from "../ui/button";
import { Banknote, FileUser, Loader2 } from "lucide-react";
import { RHFSelect, type Option } from "../rhf/rhf-select";
import { AccountIcon } from "../account-icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRegisterAccount } from "@/api/endpoints";
import type { ApiError } from "@/api/api-types";

const ACCOUNT_OPTIONS: Option[] = [
  { title: "Bank", value: "bank" },
  { title: "Cash", value: "cash" },
  { title: "Digital", value: "digital" },
  { title: "Crypto", value: "crypto" },
];

const formSchema = z.object({
  name: z.string().trim().min(3).max(255),
  balance: z.coerce.number().transform((balance) => balance / 100),
  type: z.enum(["bank", "cash", "digital", "crypto"]).default("bank"),
});

type FormType = z.infer<typeof formSchema>;

export const CreateNewAccountDialog = () => {
  const queryClient = useQueryClient();
  const { open, onClose } = useOpenAddNewAccountDialog();

  const forms = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      balance: 0,
      type: "bank",
    },
  });

  const watchAccountType = forms.watch("type") || "bank";

  const { mutate, isPending } = useMutation({
    mutationFn: (body: FormType) => ApiRegisterAccount(body),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["accounts"],
      });
      forms.reset();
      onClose();
    },
    onError: (error: ApiError) => {
      console.error("Error on register new account >>", error);
      const message = error.response.data.error;
      if (message === "You already has an account with this name") {
        forms.setError("name", { message });
        return;
      }
    },
  });

  const onSubmit = ({ name, balance, type }: FormType) => {
    if (isPending) return;
    mutate({ name, balance, type });
  };

  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Add new account</DialogTitle>
        <DialogDescription>
          Organize your finances into different accounts
        </DialogDescription>
        <Separator />
        <div>
          <RHFForm methods={forms}>
            <form
              onSubmit={forms.handleSubmit(onSubmit, (errors) => {
                console.log(errors);
              })}
              className="space-y-4">
              <RHFInput<FormType>
                label="Account name"
                name="name"
                placeholder="personal finances..."
                iconLeft={() => <FileUser />}
                required
              />
              <RHFInput<FormType>
                label="Balance"
                name="balance"
                mask="currency"
                iconLeft={() => <Banknote />}
                required
              />
              <RHFSelect<FormType>
                label="Account type"
                name="type"
                iconLeft={() => <AccountIcon type={watchAccountType} />}
                options={ACCOUNT_OPTIONS}
              />

              <div className="w-full inline-flex items-center gap-2 justify-end">
                <div>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
                <div>
                  {isPending && <Loader2 className="animate-spin" />}
                  <Button variant="blue">Create</Button>
                </div>
              </div>
            </form>
          </RHFForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};
