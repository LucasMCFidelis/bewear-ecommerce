"use client";

import React, { memo } from "react";

import { CalculateShippingCostProps } from "@/actions/calculate-shipping-cost";
import { DirectBuyDTO } from "@/app/data/direct-buy/direct-buy-dto";
import LoaderSpin from "@/components/common/loader-spin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";
import { useResolveCalculateShippingCostToCartOrDirect } from "@/hooks/queries/use-resolve-calculate-shipping-cost";

import { useCartContext } from "../cart-context";
import CartSummaryItem from "./cart-summary-item";

type CartSummaryProps<TypeDataBase extends "to-cart" | "to-direct"> = {
  children?: React.ReactNode;
} & CalculateShippingCostProps<TypeDataBase> &
  (TypeDataBase extends "to-direct"
    ? { directBuyData: DirectBuyDTO<true, true> }
    : { directBuyData?: never });

const CartSummary = <TypeDataBase extends "to-cart" | "to-direct">({
  children,
  typeDataBase,
  directBuyId,
  directBuyData,
}: CartSummaryProps<TypeDataBase>) => {
  const { selectedShippingAddress, cartSubTotalInCents, productsInCart } =
    useCartContext();

  const {
    data,
    isPending: isLoadingCalculateShippingCost,
    isError: isErrorInCalculateShippingCost,
    isRefetching: isRefetchingCalculateShippingCost,
  } = useResolveCalculateShippingCostToCartOrDirect({
    typeDataBase,
    shippingAddressId: selectedShippingAddress,
    directBuyId,
  });

  const shippingCostInCents = data?.data.freightInCents;
  const defaultShippingCostInCents = 2000;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <p className="text-sm">Subtotal</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(cartSubTotalInCents)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Frete</p>
          <div className="text-muted-foreground text-sm font-medium">
            {isLoadingCalculateShippingCost ||
            isRefetchingCalculateShippingCost ? (
              <LoaderSpin />
            ) : (
              <p>
                {isErrorInCalculateShippingCost
                  ? "Erro"
                  : formatCentsToBRL(
                      shippingCostInCents || defaultShippingCostInCents
                    )}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Total</p>
          <div className="text-muted-foreground text-sm font-medium">
            {isLoadingCalculateShippingCost ||
            isRefetchingCalculateShippingCost ? (
              <LoaderSpin />
            ) : (
              <p>
                {isErrorInCalculateShippingCost
                  ? "Erro"
                  : formatCentsToBRL(
                      cartSubTotalInCents +
                        (shippingCostInCents || defaultShippingCostInCents)
                    )}
              </p>
            )}
          </div>
        </div>

        <div className="py-3">
          <Separator />
        </div>

        {typeDataBase === "to-direct" ? (
          <CartSummaryItem
            imageUrl={directBuyData!.productVariant.imageUrl}
            productName={directBuyData!.productVariant.product.name}
            productVariantName={directBuyData!.productVariant.name}
            productQuantity={directBuyData!.quantity}
            productPriceInCents={directBuyData!.productVariant.priceInCents}
          />
        ) : (
          productsInCart.map((product) => (
            <CartSummaryItem
              key={product.id}
              imageUrl={product.imageUrl}
              productName={product.name}
              productVariantName={product.variantName}
              productQuantity={product.quantity}
              productPriceInCents={product.priceInCents}
            />
          ))
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default memo(CartSummary);
