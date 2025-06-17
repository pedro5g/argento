import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetPaginatedTransactions } from "@/api/hooks/use-get-paginated-transactions";
import { Count } from "@/components/count";
import { useState, useEffect } from "react";
import type { ListPaginatedTransactionsParams } from "@/api/api-types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronDown, CircleCheck } from "lucide-react";
import { ConfirmTransactionScheduledAlert } from "@/pages/protected/transactions/_components/dialog/confirm-transaction-scheduled-alert";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const scheduled = {
  is_scheduled: true,
  confirmed: false,
  limit: 5,
};
const recent = {
  limit: 5,
  order_by: "desc",
};

export function TransactionsMineTable() {
  const [mode, setMode] = useState<"scheduled" | "recent">("scheduled");
  const [defaultParams, setDefaultParams] =
    useState<ListPaginatedTransactionsParams>(scheduled);

  const { transactions, pagination, isPending } =
    useGetPaginatedTransactions(defaultParams);

  const isScheduled = mode === "scheduled";

  useEffect(() => {
    setDefaultParams(mode === "scheduled" ? scheduled : recent);
  }, [mode]);

  const handleNextPage = () => {
    setDefaultParams((prev) => ({
      ...prev,
      limit: (prev.limit || 5) + 5,
    }));
  };

  const handleModeChange = (newMode: "scheduled" | "recent") => {
    setMode(newMode);
  };

  return (
    <Card className="md:col-span-3 px-1 gap-2 rounded-md">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {isPending && isScheduled && "Fetching scheduled transactions"}
            {!isPending && isScheduled && "Scheduled transactions"}
            {isPending && !isScheduled && "Fetching recent transactions"}
            {!isPending && !isScheduled && "Recent transactions"}
          </CardDescription>
        </div>

        <div>
          <select
            value={mode}
            onChange={(e) =>
              handleModeChange(e.target.value as "scheduled" | "recent")
            }
            className="text-sm border border-zinc-300 rounded-md px-2 py-1 bg-white">
            <option value="scheduled">Scheduled</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </CardHeader>

      <Separator />

      <CardContent>
        <div>
          <ul className="w-full space-y-1">
            <li
              className={`grid items-center px-4 py-2 font-semibold text-sm text-zinc-600 bg-zinc-100 rounded-md ${
                isScheduled
                  ? "grid-cols-[1.5fr_1fr_1.5fr_.8fr_1.5fr_auto]"
                  : "grid-cols-[2fr_1fr_1.8fr_1.5fr]"
              }`}>
              <div>Purpose</div>
              <div>Type</div>
              <div>Create At</div>
              <div>Amount</div>
              {isScheduled && <div>Scheduled Date</div>}
              {isScheduled && <div></div>}
            </li>

            <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1">
              {isPending ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      "grid items-center px-4 py-2 rounded-md bg-zinc-50",
                      isScheduled
                        ? "grid-cols-[1.8fr_1.2fr_1.8fr_1fr_1.5fr_auto]"
                        : "grid-cols-[2fr_1fr_1.8fr_1.5fr]"
                    )}>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    {isScheduled && <Skeleton className="h-4 w-20" />}
                    {isScheduled && (
                      <Skeleton className="h-8 w-8 rounded-full" />
                    )}
                  </li>
                ))
              ) : transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className={`grid items-center px-4 py-2 rounded-md bg-zinc-50 text-sm ${
                      isScheduled
                        ? "grid-cols-[1.8fr_1.2fr_1.8fr_1fr_1.5fr_auto]"
                        : "grid-cols-[2fr_1fr_1.8fr_1.5fr]"
                    }`}>
                    <div className="truncate">
                      <div className="font-medium truncate">
                        {transaction.title}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {transaction.category_emoji} {transaction.category_name}
                      </div>
                    </div>

                    <div
                      className={cn(
                        "capitalize rounded-full text-center py-1 px-3 text-xs font-medium w-fit",
                        transaction.type === "income"
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "text-red-500 bg-red-500/10"
                      )}>
                      {transaction.type}
                    </div>

                    <div className="text-zinc-700 whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </div>

                    <div className="text-zinc-800 whitespace-nowrap">
                      <div className="font-semibold">
                        <Count amount={transaction.amount} />
                      </div>
                      {transaction.payment_method_name && (
                        <div className="text-xs text-zinc-500">
                          {transaction.payment_method_name}
                        </div>
                      )}
                    </div>

                    {isScheduled && (
                      <div className="text-zinc-700 whitespace-nowrap">
                        {transaction.scheduled_date
                          ? new Date(
                              transaction.scheduled_date
                            ).toLocaleDateString("pt-BR")
                          : "-"}
                      </div>
                    )}

                    {isScheduled && (
                      <div className="flex justify-end">
                        <ConfirmTransactionScheduledAlert
                          transactionId={transaction.id}>
                          <Button type="button" variant="outline" size="icon">
                            <CircleCheck className="stroke-green-600 w-4 h-4" />
                            <span className="sr-only">confirm transaction</span>
                          </Button>
                        </ConfirmTransactionScheduledAlert>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <p className="px-4 py-4 text-sm text-zinc-500">
                  No transactions found
                </p>
              )}
            </div>

            <div className="w-full inline-flex items-center justify-end pr-4 pt-2">
              {pagination?.has_next && (
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="text-sm text-zinc-600 hover:underline inline-flex items-center gap-1">
                  Show more <ChevronDown size={16} />
                </button>
              )}
            </div>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
