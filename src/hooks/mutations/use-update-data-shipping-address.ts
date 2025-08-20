import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDataShippingAddress } from "@/actions/update-data-shipping-address";
import { UpdateDataShippingAddressSchema } from "@/actions/update-data-shipping-address/schema";

import { getCalculateShippingCostQueryKey } from "../queries/use-calculate-shipping-cost";
import { getUserAddressesQueryKey } from "../queries/use-user-address";

export const getUpdateDataShippingAddressMutationKey = (
  shippingAddressId: string
) => ["update-data-shipping-address", shippingAddressId] as const;

export const useUpdateDataShippingAddress = (shippingAddressId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUpdateDataShippingAddressMutationKey(shippingAddressId),
    mutationFn: (data: UpdateDataShippingAddressSchema) =>
      updateDataShippingAddress({ shippingAddressId, data }),
    onSuccess: (updatedDataShippingAddress) => {
      queryClient.invalidateQueries({
        queryKey: getUserAddressesQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getCalculateShippingCostQueryKey(updatedDataShippingAddress.id),
      });
    },
  });
};
