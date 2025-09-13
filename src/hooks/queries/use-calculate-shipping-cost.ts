import { useQuery } from "@tanstack/react-query";

import {
  calculateShippingCost
} from "@/actions/calculate-shipping-cost";

export const getCalculateShippingCostQueryKey = (
  shippingAddressId: string | null, directBuyId: string| null
) => ["calculate-shipping-cost", shippingAddressId, directBuyId] as const;

export function useCalculateShippingCostToCart({
  shippingAddressId,
}: {
  shippingAddressId: string | null;
}) {
  return useQuery({
    queryKey: getCalculateShippingCostQueryKey(shippingAddressId, null),
    queryFn: () =>
      calculateShippingCost({ typeDataBase: "to-cart" }),
  });
}

export function useCalculateShippingCostToDirect({
  shippingAddressId,
  directBuyId,
}: {
  shippingAddressId: string | null;
  directBuyId: string;
}) {
  return useQuery({
    queryKey: getCalculateShippingCostQueryKey(shippingAddressId, directBuyId),
    queryFn: () =>
      calculateShippingCost({ typeDataBase: "to-direct", directBuyId }),
  });
}
