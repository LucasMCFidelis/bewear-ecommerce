"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { productVariantTable } from "@/db/schema";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariant: typeof productVariantTable.$inferSelect;
}

const ProductActions = ({ productVariant }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const quantityMax = productVariant.quantityInStock;

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => (prev < quantityMax ? prev + 1 : prev));
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="font-medium">Quantidade</h3>
        <div className="flex w-[100px] items-center justify-between rounded-lg border">
          <Button size="icon" variant="ghost" onClick={handleDecrement}>
            <MinusIcon />
          </Button>
          <p>{quantity}</p>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleIncrement}
            disabled={quantity === quantityMax}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>

      <div className="space-y-4 flex flex-col">
        <AddToCartButton
          productVariantId={productVariant.id}
          quantity={quantity}
          disabled={quantity > productVariant.quantityInStock}
        />
        <Button className="rounded-full" size={"lg"}>
          Comprar Agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
