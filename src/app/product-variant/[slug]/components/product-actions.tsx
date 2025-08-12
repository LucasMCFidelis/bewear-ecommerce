"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import { productVariantTable } from "@/db/schema";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariant: typeof productVariantTable.$inferSelect;
}

interface QuantitySelectorProps {
  quantityState: number;
  setQuantityState: Dispatch<SetStateAction<number>>;
  quantityMax: number;
}

export const QuantitySelector = ({
  quantityState,
  setQuantityState,
  quantityMax,
}: QuantitySelectorProps) => {
  const handleDecrement = () => {
    setQuantityState((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantityState((prev) => (prev < quantityMax ? prev + 1 : prev));
  };

  return (
    <div className="flex w-[100px] items-center justify-between rounded-lg border">
      <Button size="icon" variant="ghost" onClick={handleDecrement}>
        <MinusIcon />
      </Button>
      <p>{quantityState}</p>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleIncrement}
        disabled={quantityState === quantityMax}
      >
        <PlusIcon />
      </Button>
    </div>
  );
};

const ProductActions = ({ productVariant }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <>
      <div className="space-y-4">
        <h3 className="font-medium">Quantidade</h3>
        <QuantitySelector
          quantityState={quantity}
          setQuantityState={setQuantity}
          quantityMax={productVariant.quantityInStock}
        />
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
