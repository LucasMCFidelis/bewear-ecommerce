import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUserOrder } from "@/actions/delete-user-order";

import { getUserOrdersQueryKey } from "../queries/use-user-orders";

export const getDeleteUserOrderMutationKey = (orderId: string) =>
  ["delete-user-order", orderId] as const;

export const useDeleteUserOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getDeleteUserOrderMutationKey(orderId),
    mutationFn: () => deleteUserOrder({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUserOrdersQueryKey() });
    },
  });
};
