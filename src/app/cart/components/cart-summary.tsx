"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";
import { useCalculateShippingCost } from "@/hooks/queries/use-calculate-shipping-cost";

import { useShippingAddressContext } from "../address-context";

interface CartSummaryProps {
  subtotalInCents: number;
  products: Array<{
    id: string;
    name: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    widthInCentimeters: number;
    heightInCentimeters: number;
    lengthInCentimeters: number;
    weightInGrams: number;
    imageUrl: string;
  }>;
  children?: React.ReactNode;
}

const CartSummary = ({
  subtotalInCents,
  products,
  children,
}: CartSummaryProps) => {
  const { selectedShippingAddress } = useShippingAddressContext();

  const {
    data,
    isPending: isLoadingCalculateShippingCost,
    isError: isErrorInCalculateShippingCost,
  } = useCalculateShippingCost(selectedShippingAddress);

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
            {formatCentsToBRL(subtotalInCents)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Frete</p>
          <div className="text-muted-foreground text-sm font-medium">
            {isLoadingCalculateShippingCost ? (
              <Loader2 className="mr-1 animate-spin" />
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
            {isLoadingCalculateShippingCost ? (
              <Loader2 className="mr-1 animate-spin" />
            ) : (
              <p>
                {isErrorInCalculateShippingCost
                  ? "Erro"
                  : formatCentsToBRL(
                      subtotalInCents +
                        (shippingCostInCents || defaultShippingCostInCents)
                    )}
              </p>
            )}
          </div>
        </div>

        <div className="py-3">
          <Separator />
        </div>

        {products.map((product) => (
          <div className="flex items-center justify-between" key={product.id}>
            <div className="flex items-center gap-4">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={78}
                height={78}
                className="rounded-lg"
              />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-muted-foreground text-xs font-medium">
                  {product.variantName}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end justify-center gap-2">
              <p className="text-muted-foreground text-xs font-medium">
                {product.quantity} x {formatCentsToBRL(product.priceInCents)}
              </p>
              <p className="text-sm font-bold">
                {formatCentsToBRL(product.priceInCents * product.quantity)}
              </p>
            </div>
          </div>
        ))}
        {children}
      </CardContent>
    </Card>
  );
};

export default CartSummary;
