import { Outlet } from "react-router";
import { QueryProvider } from "../providers/query-provider";
import { NuqsAdapter } from "nuqs/adapters/react";

export function BaseLayout() {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <Outlet />
      </QueryProvider>
    </NuqsAdapter>
  );
}
