"use client";

import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { QuantitySelector } from "@/app/product-variant/[slug]/components/product-actions";
import { formatCentsToBRL } from "@/helpers/money";

import { Button } from "../ui/button";

interface CartItemProps {
  productName: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  productVariantQuantityInStock: number;
  quantityInitial: number;
}

const CartItem = ({
  productName,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  productVariantQuantityInStock,
  quantityInitial,
}: CartItemProps) => {
  const [quantityCurrent, setQuantityCurrent] =
    useState<number>(quantityInitial);

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
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <QuantitySelector
            quantityState={quantityCurrent}
            setQuantityState={setQuantityCurrent}
            quantityMax={productVariantQuantityInStock}
          />
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <Button variant="outline" size="icon">
          <TrashIcon />
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToBRL((productVariantPriceInCents *  quantityCurrent))}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
