import { useQuery } from "@tanstack/react-query";

import { calculateShippingCost } from "@/actions/calculate-shipping-cost";

export const getCalculateShippingCostQueryKey = (shippingAddressId: string | null) =>
  ["calculate-shipping-cost", shippingAddressId] as const;

export const useCalculateShippingCost = (shippingAddressId: string | null) => {
  return useQuery({
    queryKey: getCalculateShippingCostQueryKey(shippingAddressId),
    queryFn: () => calculateShippingCost(),
  });
};
