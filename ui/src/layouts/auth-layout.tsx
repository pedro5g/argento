import { Logo } from "@/components/logo";
import { ChartPie, CirclePlus, Wallet } from "lucide-react";
import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="relative h-screen items-center justify-center w-full flex ">
      <div aria-hidden={true} className="flex-1 h-screen bg-zinc-100"></div>
      <div aria-hidden={true} className="flex-1 h-screen bg-white"></div>

      <div className="absolute top-1/2 z-20 -translate-y-1/2 left-1/2 -translate-x-1/2 max-w-5xl w-full h-full mx-auto flex flex-1 px-10 py-20">
        <div className="flex flex-col  justify-between flex-1">
          <div>
            <Logo />
          </div>
          <div className="relative flex-1">
            <div className="absolute top-15 right-1/2 z-20 animate-float bg-white shadow rounded-xl p-4 w-fit">
              <div className="mb-4">
                <Wallet className="text-blue-400 fill-blue-100 size-8" />
                <span className="text-xs text-zinc-600">CURRENT BALANCE</span>
              </div>
              <p className="text-xs text-zinc-600">
                R${" "}
                <span className="text-base font-bold text-blue-400">
                  24,500
                </span>
              </p>
            </div>

            <div className="absolute top-65 right-1/2 animate-float delay-100 bg-white shadow rounded-xl p-2 w-fit delay-200">
              <div className="border border-dashed border-zinc-500 rounded-xl p-2">
                <div className="mb-4 w-full">
                  <CirclePlus className="text-blue-400 fill-blue-100 size-8 mx-auto" />
                </div>
                <p className="text-xs text-zinc-600">
                  Register your transactions
                </p>
              </div>
            </div>

            <div className="absolute top-40 right-35 z-30 animate-float bg-white shadow rounded-xl p-4 size-30">
              <ChartPie className="text-blue-400 size-25 m-auto" />
            </div>
          </div>

          <div className="w-full text-start grid">
            <p className="text-2xl font-semibold text-zinc-900">Welcome</p>
            <span className="text-zinc-600 ">
              Start managing your finance faster and batter
            </span>
            <span className="text-zinc-600 leading-5">
              Start managing your finance faster and batter
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center border border-red-500">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
