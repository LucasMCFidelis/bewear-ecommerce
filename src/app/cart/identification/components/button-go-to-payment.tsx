"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";

import { Button } from "@/components/ui/button";
import { useCalculateShippingCost } from "@/hooks/queries/use-calculate-shipping-cost";
import { cn } from "@/lib/utils";

import { useShippingAddressContext } from "../../address-context";

const ButtonGoToPayment = ({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const router = useRouter();
  const { selectedShippingAddress } = useShippingAddressContext();

  const {
    isPending: isLoadingCalculateShippingCost,
    isError: isErrorInCalculateShippingCost,
    isRefetching: isRefetchingCalculateShippingCost,
  } = useCalculateShippingCost(selectedShippingAddress);

  const handleGoToPayment = () => {
    router.push("/cart/confirmation");
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
