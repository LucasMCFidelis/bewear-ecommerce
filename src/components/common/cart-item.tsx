"use client";

import {
  Loader2,
  MinusIcon,
  PlusIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { useDecreaseCartProduct } from "@/hooks/mutations/use-decrease-cart-product";
import { useIncreaseCartProduct } from "@/hooks/mutations/use-increase-cart-product";
import { useRemoveProductFromCart } from "@/hooks/mutations/use-remove-product-from-cart";

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

  const removeProductFromCartMutation = useRemoveProductFromCart(cartItemId);
  const decreaseCartProductQuantityMutation =
    useDecreaseCartProduct(cartItemId);
  const increaseCartProductQuantityMutation =
    useIncreaseCartProduct(productVariantId);

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
