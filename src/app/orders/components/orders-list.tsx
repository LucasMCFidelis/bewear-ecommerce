"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Image from "next/image";

import { getUserOrders } from "@/actions/get-user-orders";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";
import { useUserOrders } from "@/hooks/queries/use-user-orders";

interface OrdersListProps {
  initialOrders: Awaited<ReturnType<typeof getUserOrders>>;
}

const OrdersList = ({ initialOrders }: OrdersListProps) => {
  const { data: orders } = useUserOrders({ initialData: initialOrders });

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
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-2">
                    <Image
                      src={item.productVariant.imageUrl}
                      alt={item.productVariant.product.name}
                      width={86}
                      height={86}
                      className="rounded-xl"
                    />
                    <div className="flex flex-col">
                      <h4 className="font-semibold">
                        {item.productVariant.product.name}
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {item.productVariant.product.description}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.productVariant.color} | Quant: {item.quantity}
                      </p>
                      <p className="font-semibold">
                        {formatCentsToBRL(item.priceInCents * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <div className="flex items-center">
                    {order.status === "pending" && (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-yellow-500" />
                        <p className="text-yellow-500 font-semibold">
                          Pendente
                        </p>
                      </>
                    )}
                    {order.status === "paid" && (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <p className="text-green-500 font-semibold">Pago</p>
                      </>
                    )}
                    {order.status === "canceled" && (
                      <>
                        <XCircle className="mr-2 h-5 w-5 text-destructive" />
                        <p className="text-red-500 font-semibold">Cancelado</p>
                      </>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <p className="text-muted-foreground">
                      {formatCentsToBRL(order.subtotalPriceInCents)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span>Transporte e Manuseio</span>
                    <p className="text-muted-foreground">
                      {formatCentsToBRL(order.shippingCostInCents)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <p className="font-semibold">
                      {formatCentsToBRL(order.totalPriceInCents)}
                    </p>
                  </div>
                </div>
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
