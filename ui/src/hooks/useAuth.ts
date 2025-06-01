import { useQuery } from "@tanstack/react-query";
import { ApiUserProfile } from "../api/endpoints";

export const useAuth = () => {
  const { data, isPending } = useQuery({
    queryFn: () => ApiUserProfile(),
    queryKey: ["user-account"],
    staleTime: 0,
    retry: 2,
  });

  return {
    userAccount: data?.userAccount,
    isPending,
  };
};
