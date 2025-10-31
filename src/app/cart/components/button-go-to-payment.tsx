"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";

import { CalculateShippingCostProps } from "@/actions/calculate-shipping-cost";
import { Button } from "@/components/ui/button";
import { useResolveCalculateShippingCostToCartOrDirect } from "@/hooks/queries/use-resolve-calculate-shipping-cost";
import { cn } from "@/lib/utils";

import { useCartContext } from "../cart-context";

export type ButtonGoToPaymentProps<
  TypeDataBase extends "to-cart" | "to-direct",
> = ButtonHTMLAttributes<HTMLButtonElement> &
  CalculateShippingCostProps<TypeDataBase> & {
    path: string;
  };

const ButtonGoToPayment = <TypeDataBase extends "to-cart" | "to-direct">({
  path,
  className,
  directBuyId,
  typeDataBase,
  ...rest
}: ButtonGoToPaymentProps<TypeDataBase>) => {
  const router = useRouter();
  const { selectedShippingAddress } = useCartContext();

  const {
    isPending: isLoadingCalculateShippingCost,
    isError: isErrorInCalculateShippingCost,
    isRefetching: isRefetchingCalculateShippingCost,
  } = useResolveCalculateShippingCostToCartOrDirect({
    typeDataBase,
    shippingAddressId: selectedShippingAddress,
    directBuyId,
  });

  const handleGoToPayment = () => {
    router.push(path);
  };

  return (
    <>
      {selectedShippingAddress && (
        <Button
          {...rest}
          onClick={handleGoToPayment}
          disabled={
            selectedShippingAddress === "add_new" ||
            isLoadingCalculateShippingCost ||
            isRefetchingCalculateShippingCost ||
            isErrorInCalculateShippingCost
          }
          className={cn("w-full", className)}
        >
          {selectedShippingAddress === "add_new"
            ? "Selecione um endereço"
            : "Ir para pagamento"}
        </Button>
      )}
    </>
  );
};

export default ButtonGoToPayment;
