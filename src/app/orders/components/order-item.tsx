import Image from "next/image";

import { formatCentsToBRL } from "@/helpers/money";

interface OrderItemProps {
  orderItemName: string;
  orderItemDescription: string;
  orderItemImageUrl: string;
  orderItemVariantColor: string;
  orderItemQuantity: number;
  orderItemPriceInCents: number;
}

const OrderItem = ({
  orderItemName,
  orderItemImageUrl,
  orderItemDescription,
  orderItemVariantColor,
  orderItemQuantity,
  orderItemPriceInCents,
}: OrderItemProps) => {
  return (
    <div className="flex gap-2">
      <Image
        src={orderItemImageUrl}
        alt={orderItemName}
        width={86}
        height={86}
        className="rounded-xl"
      />
      <div className="flex flex-col">
        <h4 className="font-semibold">{orderItemName}</h4>
        <p className="text-muted-foreground text-xs">{orderItemDescription}</p>
        <p className="text-muted-foreground text-xs">
          {orderItemVariantColor} | Quant: {orderItemQuantity}
        </p>
        <p className="font-semibold">
          {formatCentsToBRL(orderItemPriceInCents * orderItemQuantity)}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
