import { useQuery } from "@tanstack/react-query";
import { ApiListPaymentMethods } from "../endpoints";

export function useListPaymentMethods() {
  const { data, isPending } = useQuery({
    queryFn: () => ApiListPaymentMethods(),
    queryKey: ["payment-methods"],
  });

  return {
    paymentMethods: data?.paymentMethods,
    isPending,
  };
}
