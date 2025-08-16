import { useQuery } from "@tanstack/react-query";

import { getCart } from "@/actions/get-cart";

export const getUserCartQueryKey = () => ["cart"] as const;

export const useCart = (params?: {
  initialData?: Awaited<ReturnType<typeof getCart>>;
}) => {
  return useQuery({
    queryKey: getUserCartQueryKey(),
    queryFn: () => getCart(),
    initialData: params?.initialData,
  });
};
