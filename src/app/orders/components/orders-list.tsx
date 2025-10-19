"use client";

import Image from "next/image";

import { getUserOrders } from "@/actions/get-user-orders";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatAddress } from "@/helpers/address";
import { useUserOrders } from "@/hooks/queries/use-user-orders";
import { useGlobalStates } from "@/hooks/states/use-global-states";

import OrderItem from "./order-item";
import OrderStatus from "./order-status";
import OrderSummary from "./order-summary";

interface OrdersListProps {
  initialOrders: Awaited<ReturnType<typeof getUserOrders>>;
}

const OrdersList = ({ initialOrders }: OrdersListProps) => {
  const { data: orders } = useUserOrders({ initialData: initialOrders });
  const [{}, setGlobalState] = useGlobalStates();

  return (
    <>
      {orders && orders?.length > 0 ? (
        <Accordion type="multiple" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order, index) => (
            <AccordionItem key={order.id} value={order.id} className="h-fit">
              <AccordionTrigger className="py-0 items-center">
                <div className="flex">
                  <OrderStatus orderStatus={order.status} />
                  <h3 className="font-semibold">
                    Pedido{" "}
                    <span className="text-muted-foreground">
                      #{(orders.length - index).toString().padStart(3, "0")}
                    </span>
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6 font-medium">
                <Separator />
                <div className="flex flex-col gap-4">
                  <h4>Endereço de entrega</h4>
                  <Card>
                    <CardContent>
                      <p className="text-sm font-normal">
                        {formatAddress({
                          address: order.shippingAddress
                            ? order.shippingAddress
                            : null,
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Separator />
                {order.items &&
                  order.items.map((item) => {
                    if (!item.productVariant || !item.productVariant.product) {
                      throw new Error(
                        "productVariant and productVariant.product is required to render OrderItem"
                      );
                    }
                    return (
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
                    );
                  })}
                <Separator />
                <OrderSummary
                  orderId={order.id}
                  orderStatus={order.status}
                  subtotalPriceInCents={order.subtotalPriceInCents}
                  shippingCostInCents={order.shippingCostInCents}
                  totalPriceInCents={order.totalPriceInCents}
                  checkoutSessionUrl={order.checkoutSessionUrl}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <>
          <div className="flex w-full h-auto aspect-square relative">
            <Image
              src={"/illustration-order-fail.svg"}
              alt={"Lista de pedidos vazia"}
              fill
            />
          </div>
          <p className="text-center font-medium">
            Você ainda não realizou nenhum pedido.
          </p>
          <Button
            className="w-full"
            onClick={() => setGlobalState({ isCartOpen: true })}
          >
            Ir para o carrinho
          </Button>
        </>
      )}
    </>
  );
};

export default OrdersList;
