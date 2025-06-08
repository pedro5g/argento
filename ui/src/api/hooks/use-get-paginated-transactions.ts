import { useQuery } from "@tanstack/react-query";
import type { ListPaginatedTransactionsParams } from "../api-types";
import { ApiListPaginatedTransactions } from "../endpoints";

export function useGetPaginatedTransactions(
  params?: ListPaginatedTransactionsParams
) {
  const { data, isPending, error, refetch } = useQuery({
    queryFn: () => ApiListPaginatedTransactions(params),
    queryKey: ["transactions", "paginated", params],
  });

  console.log(data);

  return {
    transactions: data?.data,
    pagination: data?.pagination,
    summary: data?.summary,
    isPending,
    error,
    refetch,
  };
}
