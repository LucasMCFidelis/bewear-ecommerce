import { Trash2, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import LoaderSpin from "@/components/common/loader-spin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";
import { useCancelUserOrder } from "@/hooks/mutations/use-cancel-user-order";
import { useDeleteUserOrder } from "@/hooks/mutations/use-delete-user-order";

import OrderStatus from "./order-status";

interface OrderSummaryProps {
  orderId: string;
  orderStatus: "pending" | "paid" | "canceled";
  subtotalPriceInCents: number;
  shippingCostInCents: number;
  totalPriceInCents: number;
  checkoutSessionUrl: string | null;
}
const OrderSummary = ({
  orderId,
  orderStatus,
  shippingCostInCents,
  subtotalPriceInCents,
  totalPriceInCents,
  checkoutSessionUrl,
}: OrderSummaryProps) => {
  const deleteUserOrderMutation = useDeleteUserOrder(orderId);
  const cancelUserOrderMutation = useCancelUserOrder(orderId);

  const handleCancelUserOrder = () => {
    cancelUserOrderMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Pedido cancelado com sucesso");
      },
      onError: () => {
        toast.error("O pedido não pode ser cancelado, tente novamente");
      },
    });
  };

  const handleDeleteUserOrder = () => {
    deleteUserOrderMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Pedido deletado com sucesso");
      },
      onError: () => {
        toast.error("O pedido não pode ser deletado, tente novamente");
      },
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <span>Status</span>
        <OrderStatus orderStatus={orderStatus} componentType="complete" />
      </div>
      {orderStatus === "pending" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {checkoutSessionUrl && (
            <Button className="w-full" asChild>
              <Link href={checkoutSessionUrl}>Pagar</Link>
            </Button>
          )}
          <Button
            variant={"destructive"}
            className="w-full"
            onClick={handleCancelUserOrder}
            disabled={cancelUserOrderMutation.isPending}
          >
            {cancelUserOrderMutation.isPending ? (
              <>
                Cancelando pedido <LoaderSpin />
              </>
            ) : (
              <>
                Cancelar pedido <X />
              </>
            )}
          </Button>
        </div>
      )}
      {orderStatus === "canceled" && (
        <Button
          variant={"destructive"}
          className="w-full"
          onClick={handleDeleteUserOrder}
          disabled={deleteUserOrderMutation.isPending}
        >
          {deleteUserOrderMutation.isPending ? (
            <>
              Deletando pedido <LoaderSpin />
            </>
          ) : (
            <>
              Deletar pedido <Trash2 />
            </>
          )}
        </Button>
      )}
      <Separator />
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <p className="text-muted-foreground">
            {formatCentsToBRL(subtotalPriceInCents)}
          </p>
        </div>
        <div className="flex justify-between">
          <span>Transporte e Manuseio</span>
          <p className="text-muted-foreground">
            {formatCentsToBRL(shippingCostInCents)}
          </p>
        </div>
        <div className="flex justify-between">
          <span>Total</span>
          <p className="font-semibold">{formatCentsToBRL(totalPriceInCents)}</p>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
