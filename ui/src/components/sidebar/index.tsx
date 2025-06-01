import { AccountSwitcher } from "@/components/sidebar/account-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { NavMain } from "./nav-main";
import {
  BarChart3Icon,
  CreditCardIcon,
  HomeIcon,
  WalletIcon,
} from "lucide-react";
import { CreateNewAccountDialog } from "./create-new-account-dialog";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: WalletIcon,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: CreditCardIcon,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3Icon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userAccount, isPending } = useAuth();

  if (isPending || !userAccount) return <p>Loading...</p>;

  return (
    <>
      <Sidebar variant="inset" collapsible="icon" {...props}>
        <SidebarHeader>
          <AccountSwitcher currentAccount={userAccount.account} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMain} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <CreateNewAccountDialog />
    </>
  );
}
