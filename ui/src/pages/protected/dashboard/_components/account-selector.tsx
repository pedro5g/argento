import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { UserAccount } from "@/api/api-types";
import { useGetAccounts } from "@/api/hooks/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useSetCurrentAccount } from "@/api/hooks/use-set-current-account";

interface AccountSectionProps {
  userAccount: UserAccount;
}

function formatAccountId(id: string) {
  const digits = id.replace(/\D/g, "");

  if (digits.length < 8) {
    const start = id.slice(0, 4);
    const end = id.slice(-4);
    return `${start} •••• •••• ${end}`;
  }

  const start = digits.slice(0, 4);
  const end = digits.slice(-4);
  return `${start} •••• •••• ${end}`;
}

export const AccountsSection = ({ userAccount }: AccountSectionProps) => {
  const [currentAccount, setCurrentAccount] = useState(
    () => userAccount.account
  );
  const { data, isPending } = useGetAccounts();
  const { mutate: setCurrentAccountMutation } = useSetCurrentAccount();

  useEffect(() => {
    setCurrentAccount(userAccount.account);
  }, [userAccount]);

  const accounts = data ?? [currentAccount];
  const currentIndex = accounts.findIndex(
    (acc) => acc.id === currentAccount.id
  );

  const switchAccount = (index: number) => {
    const account = accounts[index];
    setCurrentAccount(account);
    setCurrentAccountMutation({ accountId: account.id });
  };

  const nextAccount = () => {
    const nextIndex = (currentIndex + 1) % accounts.length;
    switchAccount(nextIndex);
  };

  const prevAccount = () => {
    const prevIndex = (currentIndex - 1 + accounts.length) % accounts.length;
    switchAccount(prevIndex);
  };

  return (
    <Card className="bg-white border-0 shadow-sm md:col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending || !data ? (
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
              <div className="flex justify-between items-start mb-13 gap-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">
                    {currentAccount.name}
                  </p>
                  <p className="text-xl font-bold tracking-wider">
                    {formatAccountId(currentAccount.id)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Balance</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(currentAccount.balance.toString())}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-75">{currentAccount.type}</p>
                  <p className="font-medium">{userAccount.user.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Daily Balance</p>
                  <p className="font-medium">{format(new Date(), "dd/yy")}</p>
                </div>
              </div>

              <div className="absolute top-4 right-4 w-12 h-8 bg-white/20 rounded"></div>
              <div className="absolute top-6 right-6 w-8 h-6 bg-white/20 rounded"></div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm"
              onClick={prevAccount}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm"
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
      </CardContent>
    </Card>
  );
};

const AccountSectionSkeleton = () => {
  return <Skeleton className="w-full h-[176px] rounded-2xl" />;
};
