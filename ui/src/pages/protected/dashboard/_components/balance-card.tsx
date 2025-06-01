import type { UserAccount } from "@/api/api-types";
import { AccountIcon } from "@/components/account-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { CirclePlus, Undo2 } from "lucide-react";

interface BalanceCardProps {
  userAccount: UserAccount;
}

export const BalanceCard = ({ userAccount }: BalanceCardProps) => {
  return (
    <Card className="md:col-span-2 w-full">
      <CardHeader>
        <CardTitle className="text-zinc-800 text-xl">
          My Account balance
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="w-full text-zinc-50 px-8 py-10 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-md">
          <div className="w-full inline-flex items-start justify-between">
            <div className="space-y-4">
              <p>Total Balance</p>
              <span className="text-5xl font-bold">
                {formatCurrency(userAccount.account.balance.toString())}
              </span>
            </div>
            <div className="size-10 flex items-center justify-center rounded-full bg-white text-zinc-600">
              <AccountIcon type={userAccount.account.type} />
            </div>
          </div>
          <div className="inline-flex items-center justify-end w-full mt-5">
            <span className="">{format(new Date(), "dd/MMM/yyyy")}</span>
          </div>
        </div>
        <Separator className="my-10" />
        <div className="flex flex-col justify-between flex-1/2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-600 tracking-tighter">Account type</span>
            <span className="text-zinc-50 px-4 rounded-lg text-sm bg-gradient-to-r from-blue-400 to-blue-500">
              {userAccount.account.type}
            </span>
          </div>
          <div className="inline-flex gap-6 w-full">
            <div className="w-full">
              <Button className="flex" variant="blue">
                <Undo2 className="-rotate-90" />
                History
              </Button>
            </div>
            <div className="w-full">
              <Button className="flex" variant="blue">
                <CirclePlus />
                Top-up
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
