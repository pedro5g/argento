import { ApiGetFinancialSummary } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export const FinancialSummary = () => {
  const { data } = useQuery({
    queryFn: () => ApiGetFinancialSummary(),
    queryKey: ["financial-summary"],
  });

  console.log(data);

  return <div className="w-full bg-zinc-100 border-b border-zinc-400"></div>;
};
