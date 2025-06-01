import type { AccountType } from "@/api/api-types";
import { Bitcoin, CreditCard, Landmark, Receipt } from "lucide-react";

export const AccountIcon = ({ type }: { type: AccountType }) => {
  switch (type) {
    case "bank":
      return <Landmark className="size-4" />;
    case "cash":
      return <Receipt className="size-4" />;
    case "digital":
      return <CreditCard className="size-4" />;
    case "crypto":
      return <Bitcoin className="size-4" />;
    default:
      return <Bitcoin className="size-4" />;
  }
};
