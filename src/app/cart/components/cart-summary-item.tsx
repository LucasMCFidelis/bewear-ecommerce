import Image from "next/image";

import { formatCentsToBRL } from "@/helpers/money";

interface CartSummaryItemProps {
  imageUrl: string;
  productName: string;
  productVariantName: string;
  productQuantity: number;
  productPriceInCents: number;
}

const CartSummaryItem = ({
  imageUrl,
  productName,
  productVariantName,
  productQuantity,
  productPriceInCents,
}: CartSummaryItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={imageUrl}
          alt={productName}
          width={78}
          height={78}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <p className="text-muted-foreground text-xs font-medium">
          {productQuantity} x {formatCentsToBRL(productPriceInCents)}
        </p>
        <p className="text-sm font-bold">
          {formatCentsToBRL(productPriceInCents * productQuantity)}
        </p>
      </div>
    </div>
  );
};

export default CartSummaryItem;
