import { useQuery } from "@tanstack/react-query";
import { ApiFinancialHistoryChat } from "../endpoints";

export const periods = [
  "today",
  "yesterday",
  "last_7_days",
  "last_30_days",
  "current_month",
  "last_month",
  "current_year",
  "last_year",
] as const;

export type FinancialPeriod = (typeof periods)[number];

export function useFinancialHistory(period: FinancialPeriod) {
  return useQuery({
    queryKey: ["financial-history", period],
    queryFn: () => ApiFinancialHistoryChat({ period }),
  });
}
