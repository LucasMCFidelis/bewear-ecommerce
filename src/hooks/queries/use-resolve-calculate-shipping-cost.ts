import { useCalculateShippingCostToCart, useCalculateShippingCostToDirect } from "./use-calculate-shipping-cost";

type UseCalculateShippingCostArgs = {
  typeDataBase: "to-cart" | "to-direct";
  shippingAddressId: string | null;
  directBuyId?: string;
};

export function useResolveCalculateShippingCostToCartOrDirect({
  typeDataBase,
  shippingAddressId,
  directBuyId,
}: UseCalculateShippingCostArgs) {
  const queryToCart = useCalculateShippingCostToCart({ shippingAddressId });
  const queryToDirect = useCalculateShippingCostToDirect({
    shippingAddressId,
    directBuyId: directBuyId ?? "",
  });

  return typeDataBase === "to-direct" ? queryToDirect : queryToCart;
}
