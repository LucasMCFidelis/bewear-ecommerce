import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartShippingAddress } from "@/actions/update-cart-shipping-address";
import { UpdateCartShippingAddressSchema } from "@/actions/update-cart-shipping-address/schema";

import { getCalculateShippingCostQueryKey } from "../queries/use-calculate-shipping-cost";
import { getUserCartQueryKey } from "../queries/use-cart";

export const getUpdateCartShippingAddressMutationKey = () =>
  ["update-cart-shipping-address"] as const;

export const useUpdateCartShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUpdateCartShippingAddressMutationKey(),
    mutationFn: (data: UpdateCartShippingAddressSchema) =>
      updateCartShippingAddress(data),
    onSuccess: (updatedShippingAddress) => {
      queryClient.invalidateQueries({
        queryKey: getUserCartQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getCalculateShippingCostQueryKey(updatedShippingAddress.shippingAddressId),
      });
    },
  });
};
