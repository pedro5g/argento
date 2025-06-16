import { useQuery } from "@tanstack/react-query";
import { ApiGetFinancialSummary } from "../endpoints";

export function useGetFinancialSummary() {
  const { data, isPending, error, refetch } = useQuery({
    queryFn: () => ApiGetFinancialSummary(),
    queryKey: ["financial-summary"],
  });

  return {
    data: data?.data,
    isPending,
    error,
    refetch,
  };
}
