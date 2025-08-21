"use client"

import { getUserOrders } from "@/actions/get-user-orders";
import { useUserOrders } from "@/hooks/queries/use-user-orders";

interface OrdersListProps {
  initialOrders: Awaited<ReturnType<typeof getUserOrders>>;
}

const OrdersList = ({ initialOrders }: OrdersListProps) => {
  const { data: orders } = useUserOrders({ initialData: initialOrders });

  return (
    <>
      {orders && orders?.length > 0 ? (
        orders.map((order) => (
          <div key={order.id}>
            <p>{order.id}</p>
          </div>
        ))
      ) : (
        <>
          <p>empty</p>
        </>
      )}
    </>
  );
};

export default OrdersList;
