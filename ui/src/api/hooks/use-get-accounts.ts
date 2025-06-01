import { useQuery } from "@tanstack/react-query";
import { ApiListUserAccounts } from "../endpoints";

export function useGetAccounts() {
  const { isPending, data } = useQuery({
    queryFn: () => ApiListUserAccounts(),
    queryKey: ["accounts"],
  });

  return {
    isPending,
    data: data?.accounts,
  };
}
