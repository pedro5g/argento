import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import type { ApiError, Category, CategoryTypes } from "@/api/api-types";
import { Button } from "../ui/button";
import { Bookmark, PlusSquare, Tag } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFForm } from "../rhf/rhf-form";
import { RHFInput } from "../rhf/rhf-input";
import { RHFSelect } from "../rhf/rhf-select";
import { RHFEmojiPicker } from "../rhf/rhf-emoji-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRegisterNewCategory, ApiUpdateCategory } from "@/api/endpoints";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().trim().min(1),
  emoji: z.string().emoji(),
  type: z.enum(["income", "expense"]),
});

type FormType = z.infer<typeof formSchema>;

interface CreateCategoryDialogProps {
  type?: CategoryTypes;
  children?: React.ReactNode;
  category?: Category;
}

export const CreateCategoryDialog = ({
  type,
  children,
  category,
}: CreateCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = category
    ? {
        name: category.name,
        emoji: category.emoji,
        type: category.type,
      }
    : {
        name: "",
        emoji: type ? (type === "income" ? "💵" : "😫") : "🤑",
        type: type ? type : "income",
      };

  const forms = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: FormType) => {
      if (category) {
        return ApiUpdateCategory({ id: category.id, ...body });
      }
      return ApiRegisterNewCategory(body);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["categories"],
      });
      forms.reset();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      console.log(error);
    },
  });

  const onSubmit = ({ name, emoji, type }: FormType) => {
    if (isPending) return;
    mutate({ name, emoji, type });
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
        <DialogTitle>{category ? "Create" : "Update"} category</DialogTitle>
        <DialogDescription>
          Organize your finances into different categories
        </DialogDescription>
        <Separator />
        <RHFForm methods={forms}>
          <form
            id="crate_category_form"
            onSubmit={forms.handleSubmit(onSubmit)}
            className="space-y-6">
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <RHFEmojiPicker<FormType> name="emoji" />
              <p className="text-zinc-400 text-xs mr-auto">
                Style your categories with emojis
              </p>
            </div>
            <div>
              <RHFInput<FormType>
                label="Category name"
                name="name"
                iconLeft={() => <Bookmark />}
              />
              <p className="text-zinc-400 text-xs mr-auto mt-2">
                Enter a descriptive name for your new category
              </p>
            </div>
            {!type && (
              <RHFSelect<FormType>
                name="type"
                label="Category type"
                options={[
                  { title: "Income", value: "income" },
                  { title: "Expense", value: "expense" },
                ]}
                iconLeft={() => <Tag className="size-5" />}
              />
            )}

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
                <Button form="crate_category_form" variant="blue">
                  {category ? "Update" : "Register"}
                </Button>
              </div>
            </div>
          </form>
        </RHFForm>
      </DialogContent>
    </Dialog>
  );
};
