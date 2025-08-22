"use client";

import { getUserOrders } from "@/actions/get-user-orders";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatAddress } from "@/helpers/address";
import { useDeleteUserOrder } from "@/hooks/mutations/use-delete-user-order";
import { useUserOrders } from "@/hooks/queries/use-user-orders";

import OrderItem from "./order-item";
import OrderSummary from "./order-summary";

interface OrdersListProps {
  initialOrders: Awaited<ReturnType<typeof getUserOrders>>;
}

const OrdersList = ({ initialOrders }: OrdersListProps) => {
  const { data: orders } = useUserOrders({ initialData: initialOrders });
  const {} = useDeleteUserOrder;

  return (
    <>
      {orders && orders?.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-4">
          {orders.map((order, index) => (
            <AccordionItem key={order.id} value={order.id}>
              <AccordionTrigger className="py-0 items-center">
                <div className="flex flex-col">
                  <h3 className="font-semibold">Número do Pedido</h3>
                  <p className="text-muted-foreground">
                    #{(orders.length - index).toString().padStart(3, "0")}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6 font-medium">
                <Separator />
                <div className="flex flex-col gap-4">
                  <h4>Endereço de entrega</h4>
                  <Card>
                    <CardContent>
                      <p className="text-sm font-normal">
                        {formatAddress({ address: order.shippingAddress })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Separator />
                {order.items.map((item) => (
                  <OrderItem
                    key={item.id}
                    orderItemName={item.productVariant.product.name}
                    orderItemDescription={
                      item.productVariant.product.description
                    }
                    orderItemImageUrl={item.productVariant.imageUrl}
                    orderItemVariantColor={item.productVariant.color}
                    orderItemQuantity={item.quantity}
                    orderItemPriceInCents={item.priceInCents}
                  />
                ))}
                <Separator />
                <OrderSummary
                  orderId={order.id}
                  orderStatus={order.status}
                  subtotalPriceInCents={order.subtotalPriceInCents}
                  shippingCostInCents={order.shippingCostInCents}
                  totalPriceInCents={order.totalPriceInCents}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <>
          <p>empty</p>
        </>
      )}
    </>
  );
};

export default OrdersList;
