import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { NavUser } from "./nav-user";

export const Header = () => {
  const { userAccount, isPending } = useAuth();

  return (
    <header className="bg-white border-b border-gray-300 p-4">
      <div className="flex items-center justify-between">
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="w-80 h-4 bg-zinc-400/20" />
            <Skeleton className="w-75 h-4 bg-zinc-400/20" />
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {userAccount?.user.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Let's take a detailed look at your financial situation today
            </p>
          </div>
        )}
        <div className="flex items-center gap-4">
          <>
            {isPending || !userAccount ? (
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <Skeleton className="w-50 h-3 bg-zinc-400/20" />
                  <Skeleton className="w-45 h-3 bg-zinc-400/20" />
                </div>
                <Skeleton className="size-9 rounded-full bg-zinc-400/20" />
              </div>
            ) : (
              <div>
                <NavUser userAccount={userAccount} />
              </div>
            )}
          </>
        </div>
      </div>
    </header>
  );
};
