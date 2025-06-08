import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiSetCurrentAccount } from "../endpoints";

export function useSetCurrentAccount() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ accountId }: { accountId: string }) =>
      ApiSetCurrentAccount({ accountId }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["user-account"],
      });
      await queryClient.refetchQueries({
        queryKey: ["financial-summary"],
      });
      await queryClient.refetchQueries({
        queryKey: ["categories"],
      });
      await queryClient.refetchQueries({
        queryKey: ["clients"],
      });
      await queryClient.refetchQueries({
        queryKey: ["payment-methods"],
      });
      await queryClient.refetchQueries({
        queryKey: ["transactions"],
      });
    },
    onError: async (error) => {
      console.log(error);
    },
  });

  return { mutate };
}
