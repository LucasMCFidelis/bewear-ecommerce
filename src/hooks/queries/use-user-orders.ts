import { useQuery } from "@tanstack/react-query";

import { getUserOrders } from "@/actions/get-user-orders";

export const getUserOrdersQueryKey = () => ["user-orders"] as const;

export const useUserOrders = (params?: {
  initialData: Awaited<ReturnType<typeof getUserOrders>>;
}) => {
  return useQuery({
    queryKey: getUserOrdersQueryKey(),
    queryFn: getUserOrders,
    initialData: params?.initialData,
  });
};
