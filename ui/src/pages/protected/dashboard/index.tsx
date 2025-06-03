import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { AccountsSection } from "./_components/account-selector";
import { CreateIncomeTransactionDialog } from "@/components/dialogs/create-income-transaction-dialog";
import { CreateExpenseTransactionDialog } from "@/components/dialogs/create-expense-transaction-dialog";

export function Dashboard() {
  const navigate = useNavigate();
  const { userAccount, isPending } = useAuth();

  if (!userAccount && !isPending) {
    navigate("/", { replace: true });
  }

  if (isPending || !userAccount) return <p>Loading...</p>;

  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full flex items-center py-5 border-b border-zinc-200">
        <div className="ml-auto space-x-4">
          <CreateIncomeTransactionDialog />
          <CreateExpenseTransactionDialog />
        </div>
      </div>
      <div className="grid md:grid-cols-5 gap-4 mt-8 mb-2 w-full">
        <AccountsSection userAccount={userAccount} />
      </div>
    </div>
  );
}
