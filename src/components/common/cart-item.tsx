"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  MinusIcon,
  PlusIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import decreaseCartProductQuantity from "@/actions/decrease-cart-product-quantity";
import { removeProductFromCart } from "@/actions/remove-cart-product";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import { Button } from "../ui/button";

interface CartItemProps {
  cartItemId: string;
  productVariant: typeof productVariantTable.$inferSelect & {
    product: typeof productTable.$inferSelect;
  };
  quantity: number;
}

const CartItem = ({ cartItemId, productVariant, quantity }: CartItemProps) => {
  const {
    id: productVariantId,
    name: productVariantName,
    imageUrl: productVariantImageUrl,
    priceInCents: productVariantPriceInCents,
    quantityInStock: quantityMax,
  } = productVariant;

  const queryClient = useQueryClient();
  const removeProductFromCartMutation = useMutation({
    mutationKey: ["remove-cart-product", cartItemId],
    mutationFn: () => removeProductFromCart({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleDeleteClick = () => {
    removeProductFromCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Produto removido do carrinho.");
      },
      onError: () => {
        toast.error("Erro ao remover produto do carrinho.");
      },
    });
  };

  const decreaseCartProductQuantityMutation = useMutation({
    mutationKey: ["decrease-cart-product-quantity", cartItemId],
    mutationFn: () => decreaseCartProductQuantity({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleDecreaseQuantityClick = () => {
    decreaseCartProductQuantityMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Quantidade do produto reduzida.");
      },
      onError: () => {
        toast.error("Erro ao reduzir quantidade do produto.");
      },
    });
  };

  const increaseCartProductQuantityMutation = useMutation({
    mutationKey: ["increase-cart-product-quantity", cartItemId],
    mutationFn: () =>
      addProductToCart({ productVariantId: productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleIncreaseQuantityClick = () => {
    increaseCartProductQuantityMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Quantidade do produto aumentada.");
      },
      onError: () => {
        toast.error("Erro ao aumentar quantidade do produto.");
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={86}
          height={86}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productVariant.product.name}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <div className="flex w-[100px] items-center justify-between rounded-lg border p-1">
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleDecreaseQuantityClick}
            >
              {quantity === 1 ? <Trash2Icon /> : <MinusIcon />}
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleIncreaseQuantityClick}
              disabled={quantity === quantityMax}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDeleteClick}
          disabled={removeProductFromCartMutation.isPending}
        >
          {removeProductFromCartMutation.isPending ? (
            <>
              <Loader2 className="mr-1 animate-spin" />
            </>
          ) : (
            <TrashIcon />
          )}
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToBRL(productVariantPriceInCents * quantity)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
