import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiSetCurrentAccount } from "../endpoints";

export function useSetCurrentAccount() {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ accountId }: { accountId: string }) =>
      ApiSetCurrentAccount({ accountId }),
    onSuccess: async () => {
      const keysToInvalidate = [
        "user-account",
        "financial-summary",
        "categories",
        "clients",
        "payment-methods",
        "transactions",
        "history",
        "financial-history",
        "transaction-graph",
      ];

      await Promise.all(
        keysToInvalidate.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] })
        )
      );
    },
    onError: (error) => {
      console.error("Erro ao trocar conta atual:", error);
    },
  });

  return { mutate, isPending, isError, error };
}
