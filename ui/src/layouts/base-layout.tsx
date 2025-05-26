import { Outlet } from "react-router";
import { QueryProvider } from "../providers/query-provider";

export function BaseLayout() {
  return (
    <QueryProvider>
      <Outlet />
    </QueryProvider>
  );
}
