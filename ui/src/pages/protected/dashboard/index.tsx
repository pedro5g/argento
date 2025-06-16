import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { CreateIncomeTransactionDialog } from "@/components/dialogs/create-income-transaction-dialog";
import { CreateExpenseTransactionDialog } from "@/components/dialogs/create-expense-transaction-dialog";
import { TransactionsMineTable } from "./_components/table";
import { AccountSection } from "./_components/account-section";
import { FinancialHistoryChart } from "./_components/financial-history-chat";

export function Dashboard() {
  const navigate = useNavigate();
  const { userAccount, isPending } = useAuth();

  if (!userAccount && !isPending) {
    navigate("/", { replace: true });
  }

  if (isPending || !userAccount) return <p>Loading...</p>;

  return (
    <div className="flex flex-1 flex-col my-5">
      <div className="w-full flex items-center py-5 border-b border-zinc-200">
        <div className="ml-auto space-x-4">
          <CreateIncomeTransactionDialog />
          <CreateExpenseTransactionDialog />
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-4 mt-8 mb-6 w-full">
        <AccountSection userAccount={userAccount} />
        <TransactionsMineTable />
      </div>

      <div className="grid md:grid-cols-3 gap-4 w-full">
        <FinancialHistoryChart />
      </div>
    </div>
  );
}
