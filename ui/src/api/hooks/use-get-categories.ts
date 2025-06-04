import { useQuery } from "@tanstack/react-query";
import type { CategoryTypes } from "../api-types";
import { ApiGetCategories } from "../endpoints";

export function useGetCategories(
  type: CategoryTypes | CategoryTypes[] = ["income", "expense"]
) {
  type = Array.isArray(type) ? type : [type];
  const { data, isPending } = useQuery({
    queryFn: () => ApiGetCategories({ type }),
    queryKey: ["categories"],
  });

  return {
    categories: data?.categories,
    isPending,
  };
}
