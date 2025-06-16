import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiExportForPDF } from "../endpoints";

export function useExportPDF() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ApiExportForPDF(),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["history"] });

      const blob = new Blob([JSON.stringify(data.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `financial_history_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}
