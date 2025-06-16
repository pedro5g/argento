import type { UserAccount } from "@/api/api-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountsSection } from "./account-selector";
import { Separator } from "@/components/ui/separator";
import { HistoryDownload } from "./history-download";

interface AccountSectionProps {
  userAccount: UserAccount;
}

export const AccountSection = ({ userAccount }: AccountSectionProps) => {
  return (
    <Card className="bg-white px-1 gap-2 rounded-md md:col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full space-y-5">
          <AccountsSection userAccount={userAccount} />
          <Separator />
          <div>
            <HistoryDownload />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
