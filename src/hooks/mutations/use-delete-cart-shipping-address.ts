import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCartShippingAddress } from "@/actions/delete-cart-shipping-address";

import { getUserAddressesQueryKey } from "../queries/use-user-address";

export const getDeleteCartShippingAddressMutationKey = (
  shippingAddressId: string
) => ["delete-cart-shipping-address", shippingAddressId] as const;

export const useDeleteCartShippingAddress = (shippingAddressId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getDeleteCartShippingAddressMutationKey(shippingAddressId),
    mutationFn: () => deleteCartShippingAddress({ shippingAddressId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUserAddressesQueryKey() });
    },
  });
};
