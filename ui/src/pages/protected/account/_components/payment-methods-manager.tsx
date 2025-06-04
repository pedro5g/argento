import { useListPaymentMethods } from "@/api/hooks/use-list-payment-methods";
import { CreatePaymentMethodDialog } from "@/components/dialogs/create-payment-method-dialog";
import { DeletePaymentMethodAlert } from "@/components/dialogs/delete-payment-method-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  EditIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";

export const PaymentMethodsManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { paymentMethods } = useListPaymentMethods();

  const filteredPaymentMethods = (paymentMethods || []).filter((method) =>
    method.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Payment Methods</h2>
          <p className="text-muted-foreground">
            Manage your payment options ({(paymentMethods || []).length} total)
          </p>
        </div>
        <div>
          <CreatePaymentMethodDialog>
            <Button variant="blue">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </CreatePaymentMethodDialog>
        </div>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search payment methods..."
          className="pl-9 border-0 bg-muted/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPaymentMethods.map((method) => (
          <Card
            key={method.id}
            className="group bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-md">
            <CardContent className="px-2 py-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{method.emoji}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                      {method.name}
                    </h3>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <CreatePaymentMethodDialog paymentMethod={method}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </CreatePaymentMethodDialog>
                    <DropdownMenuSeparator />
                    <DeletePaymentMethodAlert paymentMethods={method}>
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onSelect={(e) => e.preventDefault()}>
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DeletePaymentMethodAlert>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
