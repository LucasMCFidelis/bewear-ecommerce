import { useMutation, useQueryClient } from "@tanstack/react-query";

import { finishOrderToCart } from "@/actions/finish-order";

import { getUserCartQueryKey } from "../queries/use-cart";

export const getFinishOrderToCartMutationKey = () => ["finish-order-to-cart"] as const;

export const useFinishOrderToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getFinishOrderToCartMutationKey(),
    mutationFn: async () => {
      return await finishOrderToCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserCartQueryKey(),
      });
    },
  });
};
