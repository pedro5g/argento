import { useQuery } from "@tanstack/react-query";
import { ApiUserProfile } from "../api/endpoints";

export const useAuth = () => {
  return useQuery({
    queryFn: () => ApiUserProfile(),
    queryKey: ["user-account"],
    staleTime: 0,
    retry: 2,
  });
};
