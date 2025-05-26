import { Bitcoin } from "lucide-react";

export const Logo = () => {
  return (
    <div className="inline-flex items-center justify-center text-2xl text-blue-500 bg-blue-50 px-2 rounded-md">
      <Bitcoin className="size-6" />
      <h1 className="text-zinc-600 font-semibold ">Argento</h1>
    </div>
  );
};
