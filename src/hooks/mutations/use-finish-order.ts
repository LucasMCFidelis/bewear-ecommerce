import { useMutation, useQueryClient } from "@tanstack/react-query";

import { finishOrder } from "@/actions/finish-order";

import { getUserCartQueryKey } from "../queries/use-cart";

export const getFinishOrderMutationKey = () => ["finish-order"] as const;

export const useFinishOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getFinishOrderMutationKey(),
    mutationFn: async () => {
      await finishOrder();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserCartQueryKey(),
      });
    },
  });
};
 