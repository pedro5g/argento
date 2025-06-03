import {
  Building2,
  CalendarIcon,
  Clock,
  DollarSign,
  FileText,
  Info,
  Loader2,
  Receipt,
  Repeat,
  Tag,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RHFForm } from "../rhf/rhf-form";
import { RHFInput } from "../rhf/rhf-input";
import { RHFCalender } from "../rhf/rhf-calender";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextarea } from "../rhf/rhf-textarea";
import { Label } from "../ui/label";
import { RHFCategorySelector } from "../rhf/rhf-category-selector";
import { RHFSelect } from "../rhf/rhf-select";
import { RHFSwitch } from "../rhf/rhf-switch";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ApiRegisterTransaction } from "@/api/endpoints";
import type { ApiError } from "@/api/api-types";

const recurrenceOptions = [
  { value: "none", title: "No Recurrence" },
  { value: "daily", title: "Daily" },
  { value: "weekly", title: "Weekly" },
  { value: "monthly", title: "Monthly" },
  { value: "yearly", title: "Yearly" },
];

const formSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().optional(),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().transform((amount) => amount / 100),
  date: z.coerce.date(),
  isScheduled: z.boolean().default(false),
  scheduledDate: z.coerce.date().optional(),
  confirmed: z.boolean().nullable(),
  recurrence: z
    .enum(["none", "daily", "weekly", "monthly", "yearly"])
    .default("none"),
  categoryId: z.coerce.number(),
  clientId: z.string().optional(),
  paymentMethodId: z.number().optional(),
});

export type FormType = z.infer<typeof formSchema>;

export const CreateInvoiceTransactionDialog = () => {
  const [open, setOpen] = useState(false);
  const forms = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "income",
      amount: 0,
      date: new Date(),
      isScheduled: false,
      scheduledDate: undefined,
      confirmed: null,
      recurrence: "none",
      paymentMethodId: undefined,
      clientId: undefined,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: FormType) =>
      ApiRegisterTransaction({
        title: body.title,
        description: body.description,
        date: body.date,
        amount: body.amount,
        confirmed: body.confirmed,
        is_scheduled: body.isScheduled,
        scheduled_date: body.scheduledDate,
        type: body.type,
        recurrence: body.recurrence,
        category_id: body.categoryId,
      }),
    onSuccess: ({ message }) => {
      console.log(message);
      forms.reset();
    },
    onError: (error: ApiError) => {
      console.error(error);
    },
  });

  const isScheduled = forms.watch("isScheduled");

  const onSubmit = ({
    title,
    description,
    amount,
    date,
    isScheduled,
    scheduledDate,
    confirmed,
    categoryId,
    type,
    recurrence,
  }: FormType) => {
    if (isPending) return;

    mutate({
      title,
      description,
      amount,
      date,
      isScheduled,
      scheduledDate,
      confirmed,
      categoryId,
      type,
      recurrence,
    });
  };

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-100 hover:bg-green-50 text-green-600 px-5 py-4 shadow">
          New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full min-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogTitle className="flex items-center gap-3 text-2xl font-semibold text-zinc-800">
          <div className="p-2 rounded-lg  bg-green-100 text-green-600">
            <Receipt className="h-6 w-6" />
          </div>
          Create Income
        </DialogTitle>
        <DialogDescription>
          Record income transactions, track client payments, and manage your
          revenue streams
        </DialogDescription>
        <Separator />
        <RHFForm methods={forms}>
          <form
            onSubmit={forms.handleSubmit(onSubmit, (error) => {
              console.log("Error on income form >>>", error);
            })}
            className="space-y-4 py-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/**Title */}
                  <div className="md:col-span-2">
                    <RHFInput<FormType>
                      label="Title"
                      name="title"
                      iconLeft={() => <Tag className="h-5 w-5 mt-0.5" />}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter a descriptive title for your income
                    </p>
                  </div>
                  {/**Amount and Date */}
                  <div>
                    <RHFInput<FormType>
                      label="Amount"
                      name="amount"
                      mask="currency"
                      iconLeft={() => <DollarSign className="h-5 w-5" />}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the income amount in BRL
                    </p>
                  </div>

                  <div>
                    <RHFCalender<FormType>
                      name="date"
                      label="Transaction Date *"
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      When did this transaction occur?
                    </p>
                  </div>
                </div>

                <div>
                  <RHFTextarea<FormType>
                    name="description"
                    label="Description"
                    placeholder="Detailed description of services provided or products sold..."
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Optional: Add more context or details about this transaction
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-1">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4 text-blue-600" />
                      Category *
                    </Label>
                    <RHFCategorySelector<FormType>
                      name="categoryId"
                      categoryType="income"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Categorize this transaction for better organization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                  <Info className="h-5 w-5 text-blue-600" />
                  Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recurrence */}
                  <div>
                    <RHFSelect<FormType>
                      name="recurrence"
                      label="Recurrence"
                      options={recurrenceOptions}
                      iconLeft={() => <Repeat className="h-4 w-4" />}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Set up automatic recurring transactions
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <RHFSwitch<FormType> name="isScheduled" />
                    <Label
                      htmlFor="scheduled"
                      className="text-gray-700 font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Schedule for later
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Enable this to schedule the transaction for a future date
                    instead of recording it immediately
                  </p>

                  {isScheduled && (
                    <div>
                      <Label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                        <CalendarIcon className="h-4 w-4 text-blue-600" />
                        Scheduled Date
                      </Label>
                      <RHFCalender<FormType> name="scheduledDate" />
                      <p className="text-sm text-gray-500 mt-1">
                        When should this transaction be processed?
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <DialogFooter>
              <div className="w-full inline-flex items-center justify-end gap-4">
                <div>
                  <Button
                    disabled={isPending}
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                    }}>
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button disabled={isPending} variant="blue">
                    {isPending && <Loader2 className="animate-spin" />}
                    Cadastrar
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </RHFForm>
      </DialogContent>
    </Dialog>
  );
};
