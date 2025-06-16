import { FinancialHistoryPDF } from "./financial-history-pdf";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export const HistoryDownload = () => {
  return (
    <FinancialHistoryPDF>
      <Button variant="blue">
        History
        <History />
      </Button>
    </FinancialHistoryPDF>
  );
};
