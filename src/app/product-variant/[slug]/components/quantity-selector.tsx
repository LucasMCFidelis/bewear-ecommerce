"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantityMax: number;
}

const QuantitySelector = ({ quantityMax }: QuantitySelectorProps) => {
  const [quantity, setQuantity] = useState(1);

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
          <Button size="icon" variant="ghost" onClick={handleIncrement} disabled={quantity === quantityMax}>
            <PlusIcon />
          </Button>
        </div>
      </div>
    </>
  );
};

export default QuantitySelector;
