"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ButtonHTMLAttributes } from "react";

import { addProductToCart } from "@/actions/add-cart-product";
import LoaderSpin from "@/components/common/loader-spin";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  productVariantId: string;
  quantity: number;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
  ...rest
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () => addProductToCart({ productVariantId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return (
    <>
      <Button
        className="rounded-full"
        size="lg"
        variant={isError ? "destructive" : "outline"}
        onClick={() => mutate()}
        disabled={isPending}
        {...rest}
      >
        {isPending && !isError ? (
          <>
            Adicionando à sacola <LoaderSpin />
          </>
        ) : (
          <>Adicionar à sacola</>
        )}
      </Button>
      {isError && (
        <p className="text-sm text-destructive mt-1">
          {(error as Error)?.message || "Erro ao adicionar produto"}
        </p>
      )}
    </>
  );
};

export default AddToCartButton;
