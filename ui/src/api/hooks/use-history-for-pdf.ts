import { useQuery } from "@tanstack/react-query";
import { ApiHistoryForPDF } from "../endpoints";

export function useHistoryForPDF() {
  return useQuery({
    queryFn: () => ApiHistoryForPDF(),
    queryKey: ["history"],
  });
}
