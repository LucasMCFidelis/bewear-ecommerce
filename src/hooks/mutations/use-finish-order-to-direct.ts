import { useMutation } from "@tanstack/react-query";

import { finishOrderToDirect } from "@/actions/finish-order";

export const getFinishOrderToDirectMutationKey = (
  directBuyId: string,
  shippingAddressId: string
) => ["finish-order-to-direct", directBuyId, shippingAddressId] as const;

export const useFinishOrderToDirect = (
  directBuyId: string,
  shippingAddressId: string
) => {
  return useMutation({
    mutationKey: getFinishOrderToDirectMutationKey(
      directBuyId,
      shippingAddressId
    ),
    mutationFn: async () => {
      return await finishOrderToDirect({ directBuyId, shippingAddressId });
    },
  });
};
