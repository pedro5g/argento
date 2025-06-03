import { useQuery } from "@tanstack/react-query";
import { ApiListClients } from "../endpoints";

export function useGetClients() {
  const { data, isPending } = useQuery({
    queryFn: () => ApiListClients(),
    queryKey: ["clients"],
  });

  return {
    clients: data?.clients,
    isPending,
  };
}
