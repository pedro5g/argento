"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserAccount } from "@/api/api-types";
import { getInitials } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { cookie } from "@/lib/cookies";

interface NavUserProps {
  userAccount: UserAccount;
}

export const NavUser = ({ userAccount }: NavUserProps) => {
  const queryClient = useQueryClient();
  const { user } = userAccount;

  const logout = async () => {
    cookie.deleteCookie("access_token");
    await queryClient.invalidateQueries({
      queryKey: ["user-account"],
    });
    window.location.href = "/";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center space-x-2 bg-zinc-50 px-2 py-2 rounded-md shadow-xs">
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage src={""} alt={user.name} />
          <AvatarFallback className="rounded-lg">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-zinc-800 text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>

        <ChevronsUpDown className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={""} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
