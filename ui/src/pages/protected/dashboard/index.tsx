import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

import { AccountsSection } from "./_components/account-selector";

export function Dashboard() {
  const navigate = useNavigate();
  const { userAccount, isPending } = useAuth();

  if (!userAccount && !isPending) {
    navigate("/", { replace: true });
  }

  if (isPending || !userAccount) return <p>Loading...</p>;

  return (
    <div className="grid md:grid-cols-5 gap-4 mt-8 mb-2 w-full">
      <AccountsSection userAccount={userAccount} />
    </div>
  );
}
