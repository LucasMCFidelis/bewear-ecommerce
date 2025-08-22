import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelUserOrder } from "@/actions/cancel-user-order";

import { getUserOrdersQueryKey } from "../queries/use-user-orders";

export const getCancelUserOrderMutationKey = (orderId: string) =>
  ["cancel-user-order", orderId] as const;

export const useCancelUserOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getCancelUserOrderMutationKey(orderId),
    mutationFn: () => cancelUserOrder({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUserOrdersQueryKey() });
    },
  });
};
