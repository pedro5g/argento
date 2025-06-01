import { ChevronsUpDown, Loader2, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Account } from "@/api/api-types";
import { AccountIcon } from "../account-icon";
import { useGetAccounts } from "@/api/hooks/use-get-accounts";
import { useSetCurrentAccount } from "@/api/hooks/use-set-current-account";
import { useOpenAddNewAccountDialog } from "@/hooks/nuqs/use-open-add-new-account-dialog";

interface AccountSwitcherProps {
  currentAccount: Account;
}

export function AccountSwitcher({ currentAccount }: AccountSwitcherProps) {
  const { onOpen } = useOpenAddNewAccountDialog();
  const { isMobile } = useSidebar();
  const { isPending, data } = useGetAccounts();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="bg-blue-500 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <AccountIcon type={currentAccount.type} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentAccount.name}
                </span>
                <span className="truncate text-xs">{currentAccount.type}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Accounts
            </DropdownMenuLabel>
            {isPending ? (
              <div className="w-full bg-zinc-50 py-4">
                <Loader2 className="size-4 animate-spin mx-auto" />
              </div>
            ) : (
              (data || [])
                .filter((account) => {
                  return account.id !== currentAccount.id;
                })
                .map((account) => (
                  <AccountSwitcherItem key={account.id} item={account} />
                ))
            )}
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onOpen} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Create new account
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const AccountSwitcherItem = ({ item }: { item: Account }) => {
  const { mutate } = useSetCurrentAccount();

  return (
    <DropdownMenuItem
      onClick={() => {
        mutate({ accountId: item.id });
      }}
      className="gap-2 p-2">
      <div className="flex size-6 items-center justify-center rounded-md border">
        <AccountIcon type={item.type} />
      </div>
      {item.name}
    </DropdownMenuItem>
  );
};
