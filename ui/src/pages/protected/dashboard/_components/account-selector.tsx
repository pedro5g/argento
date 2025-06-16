import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { UserAccount } from "@/api/api-types";
import { useGetAccounts } from "@/api/hooks/use-get-accounts";
import { useGetFinancialSummary } from "@/api/hooks/use-get-financial-summary";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { useSetCurrentAccount } from "@/api/hooks/use-set-current-account";

interface AccountSectionProps {
  userAccount: UserAccount;
}

export const AccountsSection = ({ userAccount }: AccountSectionProps) => {
  const [currentAccount, setCurrentAccount] = useState(
    () => userAccount.account
  );
  const { data: accountsData, isPending: isAccountsLoading } = useGetAccounts();
  const { mutate: setCurrentAccountMutation } = useSetCurrentAccount();

  const accounts = accountsData ?? [currentAccount];
  const currentIndex = accounts.findIndex(
    (acc) => acc.id === currentAccount.id
  );

  const { data: financialSummary, isPending: isSummaryLoading } =
    useGetFinancialSummary();

  const switchAccount = (index: number) => {
    const account = accounts[index];
    setCurrentAccount(account);
    setCurrentAccountMutation({ accountId: account.id });
  };

  const nextAccount = () => switchAccount((currentIndex + 1) % accounts.length);
  const prevAccount = () =>
    switchAccount((currentIndex - 1 + accounts.length) % accounts.length);

  return (
    <div>
      {isAccountsLoading || isSummaryLoading || !financialSummary ? (
        <AccountSectionSkeleton />
      ) : (
        <div className="relative">
          <div
            data-type={currentAccount.type}
            className="bg-gradient-to-r data-[type='bank']:from-blue-500 data-[type='bank']:to-blue-600 
              data-[type='cash']:from-green-500 data-[type='cash']:to-green-600 
              data-[type='digital']:from-purple-500 data-[type='digital']:to-purple-600 
              data-[type='crypto']:from-amber-600 data-[type='crypto']:to-amber-500 
              rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm opacity-80">{currentAccount.name}</p>
                <p className="text-xs opacity-70 capitalize">
                  {currentAccount.type}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Confirmed Balance</p>
                <p className="text-xl font-bold">
                  {formatCurrency(financialSummary.total_net_balance)}
                </p>
              </div>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <div>
                <p className="opacity-80">Total Income</p>
                <p className="font-semibold">
                  {formatCurrency(financialSummary.total_income)}
                </p>
              </div>
              <div className="text-right">
                <p className="opacity-80">Total Expenses</p>
                <p className="font-semibold">
                  {formatCurrency(financialSummary.total_expenses)}
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-2 border-t border-white/30 text-xs opacity-90">
              <p>Projected Balance:</p>
              <p className="font-medium">
                {formatCurrency(financialSummary.projectedBalance.toString())}
              </p>
            </div>

            <div className="absolute top-4 right-4 w-12 h-8 bg-white/20 rounded"></div>
            <div className="absolute top-6 right-6 w-8 h-6 bg-white/20 rounded"></div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/60 hover:bg-white shadow-sm"
            onClick={prevAccount}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/60 hover:bg-white shadow-sm"
            onClick={nextAccount}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex justify-center space-x-2 mt-4">
        {(accounts || []).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const AccountSectionSkeleton = () => {
  return <Skeleton className="w-full h-[176px] rounded-2xl" />;
};
