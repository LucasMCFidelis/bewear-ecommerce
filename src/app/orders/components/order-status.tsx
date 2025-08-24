import { CheckCircle, Loader2, XCircle } from "lucide-react";

interface OrderStatusProps {
  orderStatus: "pending" | "paid" | "canceled";
  componentType?: "complete" | "basic";
}

const OrderStatus = ({
  orderStatus,
  componentType = "basic",
}: OrderStatusProps) => {
  return (
    <div className="flex items-center">
      {orderStatus === "pending" && (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-yellow-500" />
          {componentType === "complete" && (
            <p className="text-yellow-500 font-semibold">Pendente</p>
          )}
        </>
      )}
      {orderStatus === "paid" && (
        <>
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          {componentType === "complete" && (
            <p className="text-green-500 font-semibold">Pago</p>
          )}
        </>
      )}
      {orderStatus === "canceled" && (
        <>
          <XCircle className="mr-2 h-5 w-5 text-destructive" />
          {componentType === "complete" && (
            <p className="text-red-500 font-semibold">Cancelado</p>
          )}
        </>
      )}
    </div>
  );
};

export default OrderStatus;
